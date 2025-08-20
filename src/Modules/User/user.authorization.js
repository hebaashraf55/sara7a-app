import { roles } from "../../DB/Models/user.model.js";


export const endPoints = {
    getProfile : [ roles.admin , roles.user],
    updateProfile : [ roles.admin , roles.user],
    freezeAccount : [ roles.admin, roles.user ],
    restoreAccount : [ roles.admin ],
    restoredByUser : [ roles.user],
    hardDeleteAccount  : [ roles.admin ],
    updatePassword : [ roles.admin , roles.user ]
}