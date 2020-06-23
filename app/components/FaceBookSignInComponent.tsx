import React, { forwardRef, SFC, useImperativeHandle } from "react";
import { TouchableOpacity, View } from "react-native";
import { AccessToken, LoginButton, LoginManager } from 'react-native-fbsdk';


interface FaceBookSignInComponentProps {
    permissions: Array<string>
    onError: any;
    responsed: any;
    onCancelled: any;
    getAccessToken: any;
    onLogout: any,
    customeButton?: any;
    ref?: any,
    disabled?: boolean
}



export const FaceBookSignInComponent: SFC<FaceBookSignInComponentProps> = forwardRef((props, ref) => {


    useImperativeHandle(ref, () => ({
        async logout() {
            const currentUser = await LoginManager.logOut();
            return currentUser
        }
    }));


    function logIn() {
        LoginManager.logInWithPermissions(props.permissions).then(
            function (result) {
                props.responsed(result);
                if (result.isCancelled) {
                    props.onCancelled()
                    console.log("Login cancelled");
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            props.getAccessToken(data)
                        }
                    )
                }
            },
            function (error) {
                props.onError(error);
                console.log("Login fail with error: " + error);
            }
        );

    }


    return (
        <View>
            {
                props.customeButton ?
                    <TouchableOpacity
                        onPress={logIn}
                        disabled={props.disabled}
                    >
                        {props.customeButton()}
                    </TouchableOpacity>
                    :
                    <LoginButton
                        onLoginFinished={
                            (error, result) => {
                                props.onError(error);
                                props.responsed(result);
                                if (error) {

                                } else if (result.isCancelled) {
                                    props.onCancelled()
                                    console.log("login is cancelled.");
                                } else {
                                    AccessToken.getCurrentAccessToken().then(
                                        (data) => {
                                            props.getAccessToken(data)
                                        }
                                    )
                                }
                            }
                        }
                        onLogoutFinished={() =>
                            props.onLogout()
                        } />
            }
        </View>
    )
})
