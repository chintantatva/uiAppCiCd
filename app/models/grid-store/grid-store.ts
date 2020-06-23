import { Instance, SnapshotOut, types, getParent } from "mobx-state-tree"
import { flow } from "mobx";
import { Api } from "../../services/api";
// const Realm = require('realm');





/**
 * A RootStore model.
 */
// prettier-ignore

export const gridListApiParamsModal = types.model("gridListApiParamsModal").props({
    limit: 10,
    offset: 0
}).actions(self => ({

}))



const userSchema = {
    name: 'Users',
    properties: {
        name: 'string',
        image: 'string',
        items: 'string[]'
    }, primaryKey: 'name',
}

const imageSchemaMultipleTabel = {
    name: 'ImagesMu',
    properties: {
        image: 'string',
    },
}

const userSchemaMultipleTabel = {
    name: 'UsersMu',
    properties: {
        name: 'string',
        image: 'string',
        images: {
            type: "list",
            objectType: "ImagesMu"
        }
    }, primaryKey: 'name',
}





const api = new Api();
api.setup()
export const GridStoreModel = types.model("GridStore").props({
    gridList: types.array(types.frozen()),
    gridListApiParams: types.optional(gridListApiParamsModal, {})
}).actions(self => ({
    fetchDataWebSocket() {
        var ws = new WebSocket('wss://echo.websocket.org');

        ws.onopen = () => {
            console.tron.log("conncection open")
            // connection opened
            ws.send('something'); // send a message
        };

        ws.onmessage = (e) => {
            console.tron.log('e', e)
            // a message was received
            // console.log(e.data);
        };

        ws.onerror = (e) => {
            // an error occurred
            console.log(e.message);
        };

        ws.onclose = (e) => {
            // connection closed
            console.log(e.code, e.reason);
        };
    },
    fetchUser: flow(function* fetchUser() {
        const userList = yield api.getGridList(self.gridListApiParams)
        if (userList.kind == 'ok') {
            // getParent(self).gridStore.setDataInRelam(userList);
            // getParent(self).gridStore.setDataInMultipleTabel(userList)
            getParent(self).gridStore.updateGridList(userList.users.data.users)
        }
    }),
    // setDataInMultipleTabel(userList) {
    //     Realm.open({
    //         schema: [imageSchemaMultipleTabel, userSchemaMultipleTabel]
    //     }).then(realm => {
    //         realm.write(() => {
    //             userList.users.data.users.forEach(obj => {
    //                 let createduser = realm.create('UsersMu', {
    //                     name: obj.name,
    //                     image: obj.image,
    //                     images: []
    //                 });
    //                 obj.items.forEach(objItem => {
    //                     createduser.images.push({
    //                         image: objItem
    //                     })
    //                 })
    //             });
    //         });
    //     }).catch((error) => {
    //         console.tron.log("err", error)
    //     })
    // },
    // setDataInRelam(userList) {
    //     // using one tabel
    //     Realm.open({
    //         schema: [userSchema]
    //     }).then(realm => {
    //         realm.write(() => {
    //             userList.users.data.users.forEach(obj => {
    //                 realm.create('Users', {
    //                     name: obj.name,
    //                     image: obj.image,
    //                     items: obj.items
    //                 });
    //             });
    //         });
    //     })
    // },
    // getDataFromRelam() {
    //     console.tron.log("path", Realm.defaultPath)
    //     //using on tabel
    //     Realm.open({
    //         schema: [userSchema, userSchemaMultipleTabel, imageSchemaMultipleTabel]
    //     }).then(realm => {
    //         console.tron.log("Realm.objects('Users')", realm.objects('UsersMu'))
    //     });
    // },
    fetchUserNewPage: flow(function* fetchUserNewPage() {
        const userList = yield api.getGridList({ offset: self.gridList.length, limit: 10 })
        if (userList.kind == 'ok') {
            getParent(self).gridStore.setDataInRelam(userList)
            getParent(self).gridStore.appendGridList(userList.users.data.users)
        }
    }),
    updateGridList(value) {
        self.gridList = value
    },
    appendGridList(value) {
        let gridList = JSON.parse(JSON.stringify(self.gridList))
        gridList = gridList.concat(value);
        self.gridList = JSON.parse(JSON.stringify(gridList))
    },
}))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof GridStoreModel> { }

/**
 * The data of a RootStore.
 */
export interface NewsStoreSnapshot extends SnapshotOut<typeof GridStoreModel> { }
