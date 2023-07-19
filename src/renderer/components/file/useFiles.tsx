import { useQuery } from "react-query";
import { getFileList } from "../../services/file";

interface IPageParams {
  pageNo: number;
  pageSize: number;
}

export const useFiles = ({ pageNo, pageSize }: IPageParams) => {
  return useQuery(["GET_FILE_LIST", pageNo, pageSize], () => {
    return getFileList({
      pageNo,
      pageSize
    });
  });
};
