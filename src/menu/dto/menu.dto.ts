import { GROCERICES_TYPE } from "src/infra/constants/app.constants";

export class ItemDTO {
  name: string;
  imageUrl: string;
  color: string;
  type: GROCERICES_TYPE;
  metadata: Record<string, any>;
}