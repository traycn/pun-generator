using System.Text.RegularExpressions;

public record WordplayFile(List<string> Templates, List<Dictionary<string, string>> Entries);

/// <summary>Fills templates like "Why did the {subject} {action}?" from wordplay entries.</summary>
public sealed partial class PunTemplates
{
    private readonly ShuffleBag<string> _bag;

    public PunTemplates(WordplayFile file, Random rng)
    {
        var combos = new List<string>();
        foreach (var template in file.Templates)
            foreach (var entry in file.Entries)
            {
                var text = Fill(template, entry);
                if (text is not null) combos.Add(text);
            }
        _bag = new ShuffleBag<string>(combos, rng);
        Count = combos.Count;
    }

    /// <summary>Number of distinct puns this generator can produce.</summary>
    public int Count { get; }

    public string Next() => _bag.Next();

    /// <summary>
    /// Fills every slot from one entry. Returns null if a slot is missing or the same
    /// word shows up in two slots (e.g. "dough" in both the setup and the payoff).
    /// </summary>
    public static string? Fill(string template, IReadOnlyDictionary<string, string> entry)
    {
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var ok = true;
        var text = SlotPattern().Replace(template, m =>
        {
            if (!entry.TryGetValue(m.Groups[1].Value, out var value)) { ok = false; return ""; }
            foreach (var word in WordPattern().Matches(value).Select(w => w.Value))
                if (word.Length > 2 && !seen.Add(word)) ok = false;
            return value;
        });
        return ok ? text : null;
    }

    [GeneratedRegex(@"\{(\w+)\}")] private static partial Regex SlotPattern();
    [GeneratedRegex(@"[\p{L}']+")] private static partial Regex WordPattern();
}
