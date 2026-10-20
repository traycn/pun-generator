// Pun Generator — console edition (a tribute to the 2012 original).
// Usage: dotnet run -- [--topic code] [--count 3] [--seed 42]
// M1 is mostly done here; M2 (--generated templates) is left for the agent.

using System.Text.Json;

var topic = ArgValue(args, "--topic");
var count = int.TryParse(ArgValue(args, "--count"), out var c) ? Math.Max(1, c) : 1;
var seed = int.TryParse(ArgValue(args, "--seed"), out var s) ? s : (int?)null;

var dataPath = Path.Combine(AppContext.BaseDirectory, "puns.json");
if (!File.Exists(dataPath))
{
    dataPath = Path.GetFullPath(Path.Combine("..", "data", "puns.json"));
}

var doc = JsonSerializer.Deserialize<PunFile>(
    File.ReadAllText(dataPath),
    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new PunFile([]);

var pool = PunFilter.ByTopic(doc.Puns, topic);

if (pool.Count == 0)
{
    Console.Error.WriteLine(topic is null
        ? "No puns found. That's not punny."
        : $"No puns for topic '{topic}'. Topics: {string.Join(", ", doc.Puns.Select(p => p.Topic).Distinct())}");
    return 1;
}

var bag = new ShuffleBag<Pun>(pool, seed is null ? new Random() : new Random(seed.Value));
for (var i = 0; i < count; i++)
{
    Console.WriteLine($"• {bag.Next().Text}");
}
return 0;

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
