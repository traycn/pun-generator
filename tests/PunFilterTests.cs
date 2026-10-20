namespace PunGenerator.Tests;

public class PunFilterTests
{
    private static readonly List<Pun> Puns =
    [
        new("code", "c1"),
        new("code", "c2"),
        new("data", "d1"),
        new("Food", "f1"),
    ];

    [Fact]
    public void FiltersToRequestedTopic()
    {
        var result = PunFilter.ByTopic(Puns, "code");

        Assert.Equal(["c1", "c2"], result.Select(p => p.Text));
    }

    [Fact]
    public void TopicMatchIsCaseInsensitive()
    {
        Assert.Single(PunFilter.ByTopic(Puns, "food"));
    }

    [Fact]
    public void NullTopicReturnsAllPuns()
    {
        Assert.Equal(Puns.Count, PunFilter.ByTopic(Puns, null).Count);
    }

    [Fact]
    public void UnknownTopicReturnsEmpty()
    {
        Assert.Empty(PunFilter.ByTopic(Puns, "nope"));
    }
}
