import axios from "axios";
import { Item } from "../../components/organisms/QueryBuilder";

const instance = axios.create({
  baseURL: "http://localhost:3000",
});

export const fetchTables = async (): Promise<string[]> => {
  const response = await instance.get("/tables");
  return response.data;
};

export const fetchColumnsFromTable = async (tableName: string): Promise<string[]> => {
  const response = await instance.get(`/columns/${tableName}`);
  return response.data;
} 

export const fetchQuery = async (items: Item[]): Promise<string> => {
  // remove the -{date} from id
  const itemsWithoutDate = items.map(item => {
    return {
      ...item,
      id: item.id.split('-')[0]
    }
  })

  const response = await instance.post(`/`, { items: itemsWithoutDate });
  return response.data;
}
