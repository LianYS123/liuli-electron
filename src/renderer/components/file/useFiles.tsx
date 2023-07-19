import { fileAPI } from "@src/common/api/file";
import { useQuery } from "react-query";

interface IPageParams {
  pageNo: number;
  pageSize: number;
}

export const useFiles = ({ pageNo, pageSize }: IPageParams) => {
  return useQuery(["GET_FILE_LIST", pageNo, pageSize], () => {
    return fileAPI.getFiles({
      pageNo,
      pageSize
    });
  });
};
