import { useQuery } from "react-query";
import { getFileList } from "../../services/file";
import { IPageParams } from "../../../common/IService";

export const useFiles = ({ pageNo, pageSize }: IPageParams) => {
  return useQuery(
    ["GET_FILE_LIST", pageNo, pageSize],
    () => {
      return getFileList({
        pageNo,
        pageSize
      });
    },
    {
      placeholderData: {
        ok: true,
        data: {
          list: [],
          total: 0,
          pageNo: 1,
          pageSize
        }
      }
    }
  );
};
