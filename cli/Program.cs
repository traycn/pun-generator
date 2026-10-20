// Pun Generator — console edition (a tribute to the 2012 original).
// Usage: dotnet run -- [--topic code] [--count 3] [--seed 42] [--generated]
// Add --generated for experimental template puns.

using System.Text.Json;

var topic = ArgValue(args, "--topic");
var count = int.TryParse(ArgValue(args, "--count"), out var c) ? Math.Max(1, c) : 1;
var seed = int.TryParse(ArgValue(args, "--seed"), out var s) ? s : (int?)null;

var json = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
var rng = seed is null ? new Random() : new Random(seed.Value);

if (args.Contains("--generated"))
{
    var wordplay = JsonSerializer.Deserialize<WordplayFile>(File.ReadAllText(DataFile("wordplay.json")), json)
        ?? new WordplayFile([], []);
    var generator = new PunTemplates(wordplay, rng);
    if (generator.Count == 0)
    {
        Console.Error.WriteLine("No usable templates. Even the generator is speechless.");
        return 1;
    }
    for (var i = 0; i < count; i++)
    {
        Console.WriteLine($"• [experimental] {generator.Next()}");
    }
    return 0;
}

var doc = JsonSerializer.Deserialize<PunFile>(File.ReadAllText(DataFile("puns.json")), json) ?? new PunFile([]);

var pool = PunFilter.ByTopic(doc.Puns, topic);

if (pool.Count == 0)
{
    Console.Error.WriteLine(topic is null
        ? "No puns found. That's not punny."
        : $"No puns for topic '{topic}'. Topics: {string.Join(", ", doc.Puns.Select(p => p.Topic).Distinct())}");
    return 1;
}

var bag = new ShuffleBag<Pun>(pool, rng);
for (var i = 0; i < count; i++)
{
    Console.WriteLine($"• {bag.Next().Text}");
}
return 0;

static string DataFile(string name)
{
    var path = Path.Combine(AppContext.BaseDirectory, name);
    return File.Exists(path) ? path : Path.GetFullPath(Path.Combine("..", "data", name));
}

static string? ArgValue(string[] args, string name)
{
    var i = Array.IndexOf(args, name);
    return i >= 0 && i + 1 < args.Length ? args[i + 1] : null;
}

public record Pun(string Topic, string Text);
public record PunFile(List<Pun> Puns);

public static class PunFilter
{
    /// <summary>Puns matching the topic (case-insensitive), or all puns when topic is null.</summary>
    public static List<Pun> ByTopic(IEnumerable<Pun> puns, string? topic) =>
        puns.Where(p => topic is null || p.Topic.Equals(topic, StringComparison.OrdinalIgnoreCase)).ToList();
}

/// <summary>Returns every item once per cycle in random order, then reshuffles.</summary>
public sealed class ShuffleBag<T>(IReadOnlyList<T> items, Random rng)
{
    private readonly List<T> _remaining = [];

    public T Next()
    {
        if (_remaining.Count == 0)
        {
            _remaining.AddRange(items);
            // Fisher–Yates
            for (var i = _remaining.Count - 1; i > 0; i--)
            {
                var j = rng.Next(i + 1);
                (_remaining[i], _remaining[j]) = (_remaining[j], _remaining[i]);
            }
        }
        var last = _remaining[^1];
        _remaining.RemoveAt(_remaining.Count - 1);
        return last;
    }
}
