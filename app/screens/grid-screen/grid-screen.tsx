import { observer } from "mobx-react-lite";
import React, { FunctionComponent as Component, useEffect, useState } from "react";
import { View, StyleSheet, Image, SectionList, FlatList, ScrollView, Dimensions, SafeAreaView } from "react-native";
import { useStores } from "../../models";
import { Text } from "../../components";
import _ from 'lodash';
import { throttle } from "../../utils";
import DeviceInfo from 'react-native-device-info';




// import { SectionGrid } from 'react-native-super-grid';




export const GridScreen: Component = observer(function GridScreen() {

    const rootStore = useStores()

    const [sectionDataList, setSectionDataList] = useState([]);

    useEffect(() => {

        setSectionListData();
        rootStore.gridStore.getDataFromRelam()
        rootStore.gridStore.fetchDataWebSocket()
        // Update the document title using the browser API
    }, []);

    useEffect(() => {
        converSectionWiseData()
        // Update the document title using the browser API
    }, [rootStore.gridStore.gridList.length]);


    function converSectionWiseData() {
        const gridList = rootStore.gridStore.gridList;
        let sectionData = [];
        gridList.map((value) => {
            let sectionObj = {};
            sectionObj['title'] = value;
            sectionObj['data'] = value.items;
            sectionData.push(sectionObj)
        });
        setSectionDataList(sectionData)
    }

    async function setSectionListData() {
        await rootStore.gridStore.fetchUser();
        converSectionWiseData()
    }


    return (
        <SafeAreaView style={styles.outerView}>
            <FlatList
                data={sectionDataList}
                onEndReached={() => {
                    rootStore.gridStore.fetchUserNewPage()
                }
                }
                keyExtractor={(index) => index.toString()}
                renderItem={({ item, index }) => {
                    let section = item
                    return (
                        <View key={index} >
                            <View style={styles.userNameOuterView} >
                                {section.title.image ? <Image source={{ uri: section.title.image ? section.title.image : "" }} style={styles.userImageStyle} /> : null}
                                <Text style={styles.sectionHeader}>{section.title.name}</Text>
                            </View>
                            <View style={styles.gridOuterView}  >
                                {
                                    section.data.map((value, index) => {
                                        const isEven = section.data.length % 2 == 0
                                        return (
                                            <View key={index} style={[styles.gridCardStyle, {
                                                height: isEven ? Dimensions.get('window').width / 2 - 20 : (
                                                    index == 0 ? Dimensions.get('window').width - 20 : Dimensions.get('window').width / 2 - 20
                                                ),
                                                width: isEven ? Dimensions.get('window').width / 2 - 20 : (
                                                    index == 0 ? Dimensions.get('window').width - 20 : Dimensions.get('window').width / 2 - 20
                                                ),

                                            }]}>
                                                <Image source={{ uri: value ? value : "" }} style={styles.gridImageStyle} />
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    )
                }

                }
                style={styles.outerView}
                onScroll={throttle((event) => {
                    let contactSize = event.nativeEvent.contentSize.height / 2;
                    if (event.nativeEvent.contentOffset.y > contactSize) {
                        rootStore.gridStore.fetchUserNewPage()
                    }
                }, 1000)}
            />


        </SafeAreaView>
    )
})
const styles = StyleSheet.create({
    outerView: {
        flex: 1,
    },
    userNameOuterView: {
        backgroundColor: "white", flexDirection: "row", alignItems: "center", paddingLeft: 20
    },
    userImageStyle: {
        height: 50, width: 50, borderRadius: 25
    },
    gridOuterView: {
        flexDirection: "row", flexWrap: 'wrap', alignItems: "center", justifyContent: "center", backgroundColor: "white"
    },
    gridCardStyle: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 5,
        padding: 10,
    },
    gridImageStyle: {
        height: "100%",
        width: "100%"
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding: 10,
        height: 150,
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
    sectionHeader: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        alignItems: 'center',
        padding: 10,
        color: "black"
    },
});