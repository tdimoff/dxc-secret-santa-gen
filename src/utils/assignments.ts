import { IPerson } from "../types/Person.interface";

export const generateAssignments = (
  participants: IPerson[]
): [IPerson[], string[]] => {
  const validParticipants = participants.filter(
    (p) => p.Name && p["SECRET SANTA"]?.toLowerCase() === "yes"
  );

  let receivers = [...validParticipants];
  let givers = [...validParticipants];
  let assignments: string[] = [];
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    assignments = [];
    let currentReceivers = [...receivers];
    let success = true;

    for (let giver of givers) {
      let validReceivers = currentReceivers.filter(
        (receiver) => receiver.Name !== giver.Name
      );

      if (validReceivers.length === 0) {
        success = false;
        break;
      }

      const randomIndex = Math.floor(Math.random() * validReceivers.length);
      const receiver = validReceivers[randomIndex];

      assignments.push(`${giver.Name} → ${receiver.Name}`);
      currentReceivers = currentReceivers.filter((r) => r.Name !== receiver.Name);
    }

    if (success) {
      return [validParticipants, assignments];
    }

    attempts++;
  }

  throw new Error(
    "Could not generate valid assignments after maximum attempts"
  );
};
