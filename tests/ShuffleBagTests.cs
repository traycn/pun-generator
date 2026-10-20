namespace PunGenerator.Tests;

public class ShuffleBagTests
{
    [Fact]
    public void NoRepeatsWithinACycle()
    {
        var items = Enumerable.Range(1, 20).ToList();
        var bag = new ShuffleBag<int>(items, new Random(1));

        var cycle = Enumerable.Range(0, items.Count).Select(_ => bag.Next()).ToList();

        Assert.Equal(items.Count, cycle.Distinct().Count());
        Assert.Equal(items, cycle.Order().ToList());
    }

    [Fact]
    public void EveryCycleCoversAllItems()
    {
        var items = new[] { "a", "b", "c", "d" };
        var bag = new ShuffleBag<string>(items, new Random(7));

        for (var cycle = 0; cycle < 5; cycle++)
        {
            var seen = Enumerable.Range(0, items.Length).Select(_ => bag.Next()).ToList();
            Assert.Equal(items.Order(), seen.Order());
        }
    }

    [Fact]
    public void SameSeedGivesSameSequence()
    {
        var items = Enumerable.Range(1, 10).ToList();
        var a = new ShuffleBag<int>(items, new Random(42));
        var b = new ShuffleBag<int>(items, new Random(42));

        Assert.Equal(
            Enumerable.Range(0, 25).Select(_ => a.Next()),
            Enumerable.Range(0, 25).Select(_ => b.Next()));
    }
}
