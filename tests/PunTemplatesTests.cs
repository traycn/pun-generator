namespace PunGenerator.Tests;

public class PunTemplatesTests
{
    private static readonly WordplayFile Data = new(
        ["Why did the {subject} {action}? Because it {payoff}."],
        [
            new() { ["subject"] = "baker", ["action"] = "quit his job", ["payoff"] = "couldn't make enough dough" },
            new() { ["subject"] = "cyclist", ["action"] = "take a nap", ["payoff"] = "was two tired" },
        ]);

    [Fact]
    public void FixedSeedProducesKnownOutput()
    {
        var generator = new PunTemplates(Data, new Random(42));

        Assert.Equal("Why did the cyclist take a nap? Because it was two tired.", generator.Next());
    }

    [Fact]
    public void SameSeedGivesSameSequence()
    {
        var a = new PunTemplates(Data, new Random(5));
        var b = new PunTemplates(Data, new Random(5));

        Assert.Equal(a.Next(), b.Next());
        Assert.Equal(a.Next(), b.Next());
    }

    [Fact]
    public void CyclesThroughEveryPunBeforeRepeating()
    {
        var generator = new PunTemplates(Data, new Random(1));

        var cycle = Enumerable.Range(0, generator.Count).Select(_ => generator.Next()).ToList();

        Assert.Equal(2, cycle.Distinct().Count());
    }

    [Fact]
    public void RejectsSameWordInTwoSlots()
    {
        var entry = new Dictionary<string, string>
        {
            ["subject"] = "baker", ["action"] = "make dough", ["payoff"] = "needed more Dough",
        };

        Assert.Null(PunTemplates.Fill("Why did the {subject} {action}? Because it {payoff}.", entry));
    }

    [Fact]
    public void RejectedEntriesAreLeftOutOfTheGenerator()
    {
        var data = new WordplayFile(
            ["{subject} {action}"],
            [
                new() { ["subject"] = "baker", ["action"] = "bakes" },
                new() { ["subject"] = "bread", ["action"] = "bread rises" },
            ]);

        Assert.Equal(1, new PunTemplates(data, new Random(1)).Count);
    }

    [Fact]
    public void MissingSlotIsRejected()
    {
        Assert.Null(PunTemplates.Fill("{subject} {nope}", new Dictionary<string, string> { ["subject"] = "baker" }));
    }

    [Fact]
    public void FillsSlotsFromEntry()
    {
        var entry = Data.Entries[0];

        Assert.Equal(
            "Why did the baker quit his job? Because it couldn't make enough dough.",
            PunTemplates.Fill(Data.Templates[0], entry));
    }
}
