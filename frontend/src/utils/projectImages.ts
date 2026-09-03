// utils/projectImages.ts

import minishell from "../assets/images/Minishell.jpg";
import minirt from "../assets/images/Mini-Rt.jpg";
import cub3d from "../assets/images/Cub-3d.jpg";
import webserv from "../assets/images/Webserv.jpg";
import ftIrc from "../assets/images/IRC.jpg";
import ftTranscendence from "../assets/images/Transcendence.jpg";
import pushSwap from "../assets/images/Push-Swap.jpg";
import aMazeIng from "../assets/images/A-Maze-ing.jpg";
import pacMan from "../assets/images/Pac-Man.jpg";
import agentSmith from "../assets/images/Agent-Smith.jpg";
import collaborativeResume from "../assets/images/Collaborative-Resume.jpg";
import defaultImage from "../assets/images/Test.jpg";

export const projectImages: Record<string, string> = {
  minishell,
  minirt,
  cub3d,
  webserv,
  ft_irc: ftIrc,
  ft_transcendence: ftTranscendence,
  push_swap: pushSwap,
  "a-maze-ing": aMazeIng,
  "pac-man": pacMan,
  "agent-smith": agentSmith,
  "42_collaborative_resume": collaborativeResume,
};

export function getProjectImage(slug: string | undefined): string {
	if (!slug) return defaultImage;
  return projectImages[slug] ?? defaultImage;
}
