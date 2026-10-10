export type DestinationId = 'earth' | 'robinhood' | 'base' | 'solana' | 'mimo';
export type Project = { name: string; category: string; description: string; contribution: string; alias?: boolean; mark: string };
export type Destination = {
  id: DestinationId; name: string; subtitle: string; count?: string; color: string;
  position: [number, number, number]; radius: number; kind: number;
  description: string; skills: string[]; projects: Project[];
};
export const contact = { email: 'aldizakiapratama@gmail.com', instagram: 'https://instagram.com/iamkizakixd', telegram: 'https://t.me/kizakixd' };
export const destinations: Destination[] = [
  { id: 'earth', name: 'Earth', subtitle: 'Home station', color: '#8bcfff', position: [10, 0, 14], radius: 8.3, kind: 0,
    description: 'Aldi Zakia Pratama. Web3 developer, AI prompter, beta tester, and technical support for teams bringing ideas online.',
    skills: ['Web development', 'Token deployment support', 'AI prompting', 'IT support'], projects: [] },
  { id: 'robinhood', name: 'Robinhood Chain', subtitle: 'Onchain products', count: '31+', color: '#c5e4a0', position: [31, 3, -21], radius: 6.4, kind: 1,
    description: 'Working alongside project teams on websites, token deployment, and the technical details behind a launch.',
    skills: ['Website development', 'Token deployment', 'Launch support'], projects: [
      { name: '9e9', category: 'Onchain Security', mark: '9/9', description: 'A website for an onchain security project, making its positioning and product information clear to visitors.', contribution: 'Website development and technical launch support.' },
      { name: 'NextFly', category: 'Web3', mark: 'NF', description: 'A Web3 project website built to give its community a clear home for the product, project information, and launch updates.', contribution: 'Website development and project support.' },
      { name: 'Irogent', category: 'Agent Finance', mark: 'IR', description: 'Finance behind every agent, made readable. An interface for exploring agent identities, supported assets, credit positions, and payment records on Robinhood Chain.', contribution: 'Website and interface development for agent finance information.' },
      { name: 'Terrava', category: 'RWA', mark: 'TV', alias: true, description: 'A client project in real-world assets, with a website presenting its asset narrative and ecosystem information.', contribution: 'Website development, deployment assistance, and technical support.' },
      { name: 'Veltrix', category: 'Finance', mark: 'VX', alias: true, description: 'A finance-focused client project, with a clear web presence for its product story and community launch.', contribution: 'Frontend implementation and launch support.' },
    ] },
  { id: 'base', name: 'Base', subtitle: 'Ethereum ecosystem', count: '78+', color: '#86b2ff', position: [-29, 1, -16], radius: 7, kind: 2,
    description: 'Websites and deployment support for independent teams building products and token communities on Base.',
    skills: ['Web development', 'Deployment support', 'Team collaboration'], projects: [
      { name: 'Avenor', category: 'RWA', mark: 'AV', alias: true, description: 'A real-world asset client project, presented through a website that connects its product story with its onchain community.', contribution: 'Website design, frontend development, and deployment support.' },
      { name: 'Cognira', category: 'AI Agents', mark: 'CG', alias: true, description: 'A client project exploring AI agents, with web pages that explain the agent concept and project direction.', contribution: 'Website development and technical launch assistance.' },
      { name: 'Fluxora', category: 'Finance', mark: 'FX', alias: true, description: 'A finance client project with a web interface for explaining its offering and helping visitors navigate project information.', contribution: 'Frontend development and deployment support.' },
      { name: 'Nodalyn', category: 'Infrastructure', mark: 'ND', alias: true, description: 'An infrastructure-focused client website, built around readable technical information and a cohesive project identity.', contribution: 'Website implementation and IT support.' },
      { name: 'Orbitale', category: 'Community', mark: 'OR', alias: true, description: 'A token community website that brings the project introduction, links, and launch information into one place.', contribution: 'Website development and token launch support.' },
    ] },
  { id: 'solana', name: 'Solana', subtitle: 'Independent launch teams', count: '45+', color: '#c9a6f9', position: [46, -3, 30], radius: 5.9, kind: 3,
    description: 'Helping independent Solana teams with websites, token launch preparation, and ongoing technical support.',
    skills: ['Website development', 'Token launch support', 'Technical operations'], projects: [
      { name: 'Solvane', category: 'RWA', mark: 'SV', alias: true, description: 'A real-world asset client project, with a web presentation built around its asset concept and community.', contribution: 'Website development and deployment support.' },
      { name: 'Aetheris', category: 'AI Agents', mark: 'AE', alias: true, description: 'An agent-focused client project with a website introducing its concept, identity, and ecosystem direction.', contribution: 'Web design, frontend development, and launch support.' },
      { name: 'LumaFi', category: 'Finance', mark: 'LF', alias: true, description: 'A finance-focused client website designed to make project information accessible to its community.', contribution: 'Website implementation and technical support.' },
      { name: 'Meshora', category: 'DePIN', mark: 'MS', alias: true, description: 'A decentralized infrastructure client project, with a website explaining its network narrative and participation concept.', contribution: 'Frontend development and deployment assistance.' },
      { name: 'Kometra', category: 'Community', mark: 'KM', alias: true, description: 'A community token website combining a distinct visual identity with straightforward launch information.', contribution: 'Website development and token launch assistance.' },
    ] },
  { id: 'mimo', name: 'Xiaomi / MiMo AI', subtitle: 'AI development contributions', color: '#ffd29a', position: [-21, -4, 32], radius: 5.3, kind: 4,
    description: 'Contributing through AI prompting, beta testing, and occasional IT support for the team.',
    skills: ['AI prompting', 'Beta testing', 'Test feedback', 'IT support'], projects: [
      { name: 'Prompt development', category: 'AI Prompting', mark: '01', description: 'Designing and refining prompts to explore how the model follows instructions and responds to different tasks.', contribution: 'AI prompting and iterative prompt refinement.' },
      { name: 'Beta evaluation', category: 'AI Testing', mark: '02', description: 'Trying beta versions across practical tasks and observing the quality and consistency of the responses.', contribution: 'Hands-on beta testing.' },
      { name: 'Behavior feedback', category: 'Testing Feedback', mark: '03', description: 'Documenting observed issues and sharing clear feedback that the team can use to investigate model behavior.', contribution: 'Test observations and feedback.' },
      { name: 'Prompt iteration', category: 'AI Workflow', mark: '04', description: 'Revisiting prompts after tests to improve clarity, task framing, and the usefulness of the output.', contribution: 'Prompt experimentation and refinement.' },
      { name: 'Technical support', category: 'IT Support', mark: '05', description: 'Occasional technical assistance for the team alongside prompting and beta testing work.', contribution: 'IT support as needed.' },
    ] },
];
export const findDestination = (id: DestinationId) => destinations.find(d => d.id === id)!;
