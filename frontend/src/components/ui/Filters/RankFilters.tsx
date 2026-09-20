import Option from "../Options/Options";

function RankFilter({
  userRank,
  projectRank,
  selectedRank,
  onChange,
}: {
  userRank: number;
  projectRank: number;
  selectedRank: number | null;
  onChange: (rank: number | null) => void;
}) {
  const startRank = Math.max(1, userRank - 1);

  const ranks = Array.from(
    { length: projectRank - startRank + 1 },
    (_, index) => startRank + index
  );

  return (
	 <div className={`flex gap-0.5 bg-background-dark rounded-lg p-0.75`}>
      {ranks.map((rank) => (
        <Option
          key={rank}
          label={`Rank ${rank}`}
          selected={selectedRank === rank}
          onClick={() =>
            onChange(selectedRank === rank ? null : rank)
          }
        />
      ))}
    </div>
  );
}

export default RankFilter;



// function RankFilter({
//   userRank,
//   projectRank,
//   selectedRank,
//   onChange,
// }: {
//   userRank: number;
//   projectRank: number;
//   selectedRank: number | null;
//   onChange: (rank: number | null) => void;
// }) {
//   const startRank = Math.max(1, userRank - 1);

//   const ranks = Array.from(
//     { length: projectRank - startRank + 1 },
//     (_, index) => startRank + index
//   );

//   return (
//     <div className="flex gap-2">
//       {ranks.map((rank) => (
//         <button
//           key={rank}
//           type="button"
//           onClick={() =>
//             onChange(selectedRank === rank ? null : rank)
//           }
//           className={
//             selectedRank === rank
//               ? "px-3 py-1 rounded bg-purple text-white"
//               : "px-3 py-1 rounded border"
//           }
//         >
//           Rank {rank}
//         </button>
//       ))}
//     </div>
//   );
// }

// export default RankFilter;
