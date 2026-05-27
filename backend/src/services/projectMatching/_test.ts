import { generateUsers } from "./_dummieUserCreation.js";
import { applyFilters } from "./GenericFilterEngine.js";
import { showPotentialPartners } from "./showPotentialPartners.js";

const users = generateUsers(200);

console.log("TOTAL USERS:", users.length);
console.log("=================================\n");

// Pick a reference user
const targetUser = users[5];

console.log("TARGET USER:");
console.log({
	id: targetUser.id,
	rank: targetUser.rank,
	preferredOnCampus: targetUser.preferredOnCampus,
	hoursPerWeek: targetUser.hoursPerWeek
});

console.log("\n=================================\n");

const potentialMatches = showPotentialPartners(targetUser, users);

console.log("POTENTIAL MATCHES:", potentialMatches.length);
console.log(potentialMatches.slice(0, 5));

console.log("\n=================================\n");

const onCampusResults = applyFilters(potentialMatches, [
	{ key: "preferredOnCampus", value: true }
]);

console.log("ON CAMPUS RESULTS:", onCampusResults.length);
console.log(onCampusResults.slice(0, 5));

console.log("\n=================================\n");

const hoursResults = applyFilters(potentialMatches, [
	{ key: "hoursPerWeek", value: "11-20" }
]);

console.log("\nHOURS (11-20) RESULTS:", hoursResults.length);
console.log(hoursResults.slice(0, 5));

console.log("\n=================================\n");

const rankResults = applyFilters(potentialMatches, [
	{ key: "rank", value: targetUser.rank }
]);

console.log("\nRANK MATCH RESULTS:", rankResults.length);
console.log(rankResults.slice(0, 5));

console.log("\n=================================\n");

const combined = applyFilters(potentialMatches, [
	{ key: "rank", value: targetUser.rank },
	{ key: "preferredOnCampus", value: true },
	{ key: "hoursPerWeek", value: "11-20" }
]);

console.log("\nCOMBINED MATCH RESULTS:", combined.length);
console.log(combined.slice(0, 10));

