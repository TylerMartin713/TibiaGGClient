export const GetAllQuests = () => {
  return fetch("http://localhost:8000/quests").then((res) => res.json());
};

export const GetQuestById = (questId) => {
  return fetch(`http://localhost:8000/quests/${questId}`).then((res) =>
    res.json()
  );
};

export const CreateQuest = (questData) => {
  return fetch("http://localhost:8000/quests", {
    method: "POST",
    headers: {
      Authorization: `Token ${localStorage.getItem("TibiaGG_token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(questData),
  }).then((res) => res.json());
};

export const DeleteQuest = (questId) => {
  return fetch(`http://localhost:8000/quests/${questId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${localStorage.getItem("TibiaGG_token")}`,
    },
  });
};
