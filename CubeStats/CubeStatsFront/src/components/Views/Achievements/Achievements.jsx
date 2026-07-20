import { achievementCategories } from "./achievementsData";

const AchievementItem = ({ item }) => (
  <li className="py-2 border-b border-gray-100 last:border-0">
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-gray-800">{item.title}</span>
      {item.claimed && (
        <span className="shrink-0 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">
          Claimed
        </span>
      )}
    </div>
    {item.note && <p className="text-sm text-gray-500">{item.note}</p>}
    {item.sub && (
      <ul className="mt-1 ml-4 pl-3 border-l border-gray-200">
        {item.sub.map((sub, i) => (
          <li key={i} className="py-1">
            <span className="text-gray-700">{sub.title}</span>
            {sub.note && (
              <span className="text-sm text-gray-500"> — {sub.note}</span>
            )}
          </li>
        ))}
      </ul>
    )}
  </li>
);

export const Achievements = () => {
  return (
    <>
      <h1 className="text-4xl font-bold text-blue-600 mt-6">Achievements</h1>

      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6">
        <p className="text-base text-gray-700">
          A running bucket list for the cube — combo kills, alternate win
          conditions, splashy haymakers, and a few deliberately silly
          challenges. Things to pull inspiration for drafting and see what's
          been done before.
        </p>
      </div>

      {achievementCategories.map((group) => (
        <div
          key={group.category}
          className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6"
        >
          <h2 className="text-2xl font-semibold mb-4">{group.category}</h2>
          <ul>
            {group.items.map((item, i) => (
              <AchievementItem key={`${item.title}-${i}`} item={item} />
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};
