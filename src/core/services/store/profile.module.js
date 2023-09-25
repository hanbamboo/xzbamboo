// action types
export const UPDATE_PERSONAL_INFO = "updateUserInfo";
export const UPDATE_ACCOUNT_INFO = "updateUserInfo";

// mutation types
export const SET_PERSONAL_INFO = "setUserInfo";
export const PERSONAL_INFO = "userInfo";
export const SET_ACCOUNT_INFO = "setAccountInfo";


const state = {
    user_info: {
        searchValue: null,
        createBy: "",
        createTime: "",
        updateBy: null,
        updateTime: null,
        remark: "",
        params: {},
        userId: 0,
        deptId: 0,
        userName: "",
        nickName: "",
        email: " ",
        phonenumber: "",
        sex: "0",
        avatar: "",
        salt: null,
        status: 0,
        delFlag: 0,
        loginIp: "",
        loginDate: "",
        online: 0,
        onlineName: null,
        sign: "",
        dept: {
            searchValue: null,
            createBy: null,
            createTime: null,
            updateBy: null,
            updateTime: null,
            remark: null,
            params: {},
            deptId: 100,
            parentId: 0,
            ancestors: null,
            deptName: "大秦的神秘世界",
            orderNum: 0,
            leader: "daqin",
            phone: null,
            email: null,
            status: 0,
            delFlag: null,
            parentName: null,
            children: []
        },
        roles: [],
        roleIds: null,
        roleId: null,
        admin: false,
        hasStatus: false,

    },
    user_account_info: {
        username: "nick84",
        email: "nick.watson@loop.com",
        language: "English",
        time_zone: "(GMT-11:00) Midway Island",
        communication: {
            email: true,
            sms: true,
            phone: false
        },
        verification: true
    }
};

const getters = {
    currentUserPersonalInfo(state) {
        if (!state.user_info.hasStatus) {
            const s = localStorage.getItem(PERSONAL_INFO);
            if (s != null) {
                state.user_info = JSON.parse(s);
                return state.user_info;
            }
        }
        return state.user_info;
    },

    currentUserAccountInfo(state) {
        return state.user_account_info;
    },

    currentUserPhoto(state) {
        return state.user_info.photo;
    }
};

const actions = {
    [UPDATE_PERSONAL_INFO](context, payload) {
        context.commit(SET_PERSONAL_INFO, payload);
    },
    [UPDATE_ACCOUNT_INFO](context, payload) {
        context.commit(SET_ACCOUNT_INFO, payload);
    }
};

const mutations = {
    [SET_PERSONAL_INFO](state, user_info) {
        state.user_info = user_info;
        localStorage.setItem(PERSONAL_INFO, JSON.stringify(user_info));
    },
    [SET_ACCOUNT_INFO](state, user_account_info) {
        state.user_account_info = user_account_info;
    }
};

export default {
    SET_PERSONAL_INFO,
    PERSONAL_INFO,
    state,
    actions,
    mutations,
    getters
};
