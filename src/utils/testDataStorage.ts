import { TestData } from "../types/testData";

const STORAGE_KEY = "shrthnder_test_data";

export const saveTestData = (data: TestData): void => {
  try {
    const existingData = getTestData();
    const updatedData = [...existingData, data];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error("Error saving test data:", error);
  }
};

export const getTestData = (): TestData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error retrieving test data:", error);
    return [];
  }
};

export const clearTestData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing test data:", error);
  }
};

export const exportTestData = (): void => {
  try {
    const data = getTestData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `shrthnder_test_data_${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting test data:", error);
  }
};
