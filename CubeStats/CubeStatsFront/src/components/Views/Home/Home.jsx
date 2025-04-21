export const Home = () => {
  return (
    <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6">
      <p className="text-base text-gray-700">
        This site is a companion to my custom Magic: The Gathering draft cube —
        a large and carefully segmented card pool used in a self-built draft
        application. Here, you can explore analytics based on draft data: which
        cards get picked, which don’t, and how different colors and card
        categories perform over time. It’s a tool for tracking trends and
        balancing the cube.
      </p>
      <br />
      <p className="text-base text-gray-700">
        And thanks to my friend{" "}
        <a
          href="https://samulituomainen.wixsite.com/portfolio"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Samuli Tuomainen
        </a>{" "}
        for the help with the design and the wizards.
      </p>

      <br />
      <h1 className="text-2xl font-bold">
        Welcome to the Draft Analytics Dashboard
      </h1>
      <br />
      <p>
        This analytics site provides insights into data collected from my custom
        Magic: The Gathering draft application. While the app itself isn’t
        running continuously due to cost constraints, each draft session
        contributes new data to a small ETL pipeline:
      </p>
      <br />
      <ul className="list-disc list-inside space-y-1">
        <li>
          <strong>Raw data collection:</strong> For each draft, the order in
          which cards are picked from both main and commander packs is stored.
        </li>
        <li>
          <strong>Data transformation:</strong> When new data is available, I
          parse it to compute <em>pick rates</em> for individual cards, both in
          general and within commander packs. Additionally, I generate summary
          data on color identities and draft pool compositions.
        </li>
        <li>
          <strong>Data hosting:</strong> The processed JSON data is hosted via
          GitHub Pages.
        </li>
        <li>
          <strong>Frontend access:</strong> This analytics page reads from that
          hosted JSON and presents the data interactively.
        </li>
      </ul>

      <br />
      <h2 className="text-xl font-semibold">What Can You Explore?</h2>

      <br />
      <div>
        <h3 className="text-lg font-semibold">Overview</h3>
        <p>
          The size of my custom cube (over 2400 cards) makes it essential to
          manage how cards are included in each draft. To keep things fair and
          consistent, I've divided the cube into <em>draft pools</em> — one for
          each color, one for multicolor, one for colorless cards, and one for
          lands (with all of them containing some custom tweaks). These pools
          help maintain balanced representation in each draft, even when the
          underlying pool sizes are uneven.
        </p>
        <br />
        <p>
          This section lets you compare average pick rates across color
          identities and draft pools, as well as explore how multicolor pool
          break down by color identity.
        </p>
      </div>

      <div>
        <br />
        <h3 className="text-lg font-semibold">Color Identity</h3>
        <p>
          Browse cards grouped by their color identity — single, dual, or
          three-color. Cards are sorted by lowest pick rate first, highlighting
          the less favored choices, which are particularly useful for my
          analysis and cube tuning. 
          </p>
        <br />
        <p>
          The cards can be filtered by color identity, name, type, oracle text
          and mana value. Type and oracle text here and filters elsewhere
          recognise regex patterns, allowing for more complex queries.
        </p>
      </div>

      <div>
        <br />
        <h3 className="text-lg font-semibold">Draft Pool</h3>
        <p>
          Explore pick rate data within each draft pool. This view helps
          identify how individual cards perform across the color, multicolor,
          colorless, and land segments — supporting balance checks and tuning.
        </p>
        <br />
        <p>
          Depending on the pool, you can filter by color identity, name, type,
          oracle text, and mana value.
        </p>
      </div>

      <div>
        <br />
        <h3 className="text-lg font-semibold">Commanders</h3>
        <p>
          This view helps explore how different commanders are supported within
          the cube. By selecting a color identity, you can browse all commanders
          that match it, along with their draft pick data (when available).
          Beneath each group, you’ll find a type distribution table showing how
          many cards of each type — creatures, enchantments, instants, etc. —
          are available across all valid sub-color identities.
        </p>
        <br />
        <p>
          This allows you to evaluate how well the cube supports different
          commander strategies. For example, if you’re curious about an
          enchantress commander in colors W and G, the table shows how many
          enchantments exist in W, G, and WG, giving insight into whether the
          archetype is viable or lacking in support.
        </p>
      </div>

      <div>
        <br />
        <h3 className="text-lg font-semibold">All Cards</h3>
        <p>
          This view lets you browse and filter the entire cube — regardless of
          whether cards have been drafted or not. It’s useful for exploring
          support for specific archetypes or verifying if certain cards are
          included.
        </p>
        <br />
        <p>
          The cards can be filtered by color identity, name, type, oracle text,
          and mana value.
        </p>
      </div>
    </div>
  );
};
