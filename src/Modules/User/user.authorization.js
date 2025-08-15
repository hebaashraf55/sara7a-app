import { roles } from "../../DB/Models/user.model.js";


export const endPoints = {
    getProfile : [ roles.admin , roles.user]
}