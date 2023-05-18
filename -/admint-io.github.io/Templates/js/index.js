//import "https://cdn.ethers.io/scripts/ethers-v3.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.4/axios.min.js";
import * as config from "./config.js";

export var campaignId="undefined";
var inviteCode="undefined";
var domainName="undefined";
var creativeId="undefined";


function get_color_value(cs, category, color_name) {
    if(category in cs){
        let category_data = cs[category];
        let color_data = category_data[color_name];
        let color_value = color_data['value'];
        return color_value;
    }
    else{
        return;
    }    
}
function figma_json_to_ftd(json) {

    return new Promise(async (resolve, reject) => {
        try{
            const cs_data = JSON.parse(json);
            let cs_light = Object.keys(cs_data)
                .filter((key) => key.includes("-light"))
                .reduce((obj, key) => {
                obj = cs_data[key];
                return obj;
            }, {});
            let cs_dark = Object.keys(cs_data)
                .filter((key) => key.includes("-dark"))
                .reduce((obj, key) => {
                obj = cs_data[key];
                return obj;
            }, {});
        
            
            let colorsObj= `
            -- ftd.color base-:
            light: ${get_color_value(cs_light, "Background Colors", "base")}
            dark: ${get_color_value(cs_dark, "Background Colors", "base")}
        
            -- ftd.color step-1-:
            light: ${get_color_value(cs_light, "Background Colors", "step-1")}
            dark: ${get_color_value(cs_dark, "Background Colors", "step-1")}
        
            -- ftd.color step-2-:
            light: ${get_color_value(cs_light, "Background Colors", "step-2")}
            dark: ${get_color_value(cs_dark, "Background Colors", "step-2")}
        
            -- ftd.color overlay-:
            light: ${get_color_value(cs_light, "Background Colors", "overlay")}
            dark: ${get_color_value(cs_dark, "Background Colors", "overlay")}
        
            -- ftd.color code-:
            light: ${get_color_value(cs_light, "Background Colors", "code")}
            dark: ${get_color_value(cs_dark, "Background Colors", "code")}
        
            -- ftd.color border-:
            light: ${get_color_value(cs_light, "Standalone Colors", "border")}
            dark: ${get_color_value(cs_dark, "Standalone Colors", "border")}
        
            -- ftd.color border-strong-:
            light: ${get_color_value(cs_light, "Standalone Colors", "border-strong")}
            dark: ${get_color_value(cs_dark, "Standalone Colors", "border-strong")}
        
            -- ftd.color text-:
            light: ${get_color_value(cs_light, "Standalone Colors", "text")}
            dark: ${get_color_value(cs_dark, "Standalone Colors", "text")}
        
            -- ftd.color text-strong-:
            light: ${get_color_value(cs_light, "Standalone Colors", "text-strong")}
            dark: ${get_color_value(cs_dark, "Standalone Colors", "text-strong")}
        
            -- ftd.color shadow-:
            light: ${get_color_value(cs_light, "Standalone Colors", "shadow")}
            dark: ${get_color_value(cs_dark, "Standalone Colors", "shadow")}
        
            -- ftd.color scrim-:
            light: ${get_color_value(cs_light, "Standalone Colors", "scrim")}
            dark: ${get_color_value(cs_dark, "Standalone Colors", "scrim")}
        
            -- ftd.color cta-primary-base-:
            light: ${get_color_value(cs_light, "CTA Primary Colors", "base")}
            dark: ${get_color_value(cs_dark, "CTA Primary Colors", "base")}
        
            -- ftd.color cta-primary-hover-:
            light: ${get_color_value(cs_light, "CTA Primary Colors", "hover")}
            dark: ${get_color_value(cs_dark, "CTA Primary Colors", "hover")}
        
            -- ftd.color cta-primary-pressed-:
            light: ${get_color_value(cs_light, "CTA Primary Colors", "pressed")}
            dark: ${get_color_value(cs_dark, "CTA Primary Colors", "pressed")}
        
            -- ftd.color cta-primary-disabled-:
            light: ${get_color_value(cs_light, "CTA Primary Colors", "disabled")}
            dark: ${get_color_value(cs_dark, "CTA Primary Colors", "disabled")}
        
            -- ftd.color cta-primary-focused-:
            light: ${get_color_value(cs_light, "CTA Primary Colors", "focused")}
            dark: ${get_color_value(cs_dark, "CTA Primary Colors", "focused")}
        
            -- ftd.color cta-primary-border-:
            light: ${get_color_value(cs_light, "CTA Primary Colors", "border")}
            dark: ${get_color_value(cs_dark, "CTA Primary Colors", "border")}
        
            -- ftd.color cta-primary-text-:
            light: ${get_color_value(cs_light, "CTA Primary Colors", "text")}
            dark: ${get_color_value(cs_dark, "CTA Primary Colors", "text")}
        
            -- ftd.color cta-primary-text-disabled-:
            light: ${get_color_value(cs_light, "CTA Primary Colors", "text-disabled")}
            dark: ${get_color_value(cs_dark, "CTA Primary Colors", "text-disabled")}
        
            -- ftd.color cta-primary-border-disabled-:
            light: ${get_color_value(cs_light, "CTA Primary Colors", "border-disabled")}
            dark: ${get_color_value(cs_dark, "CTA Primary Colors", "border-disabled")}
        
            -- ftd.color cta-secondary-base-:
            light: ${get_color_value(cs_light, "CTA Secondary Colors", "base")}
            dark: ${get_color_value(cs_dark, "CTA Secondary Colors", "base")}
        
            -- ftd.color cta-secondary-hover-:
            light: ${get_color_value(cs_light, "CTA Secondary Colors", "hover")}
            dark: ${get_color_value(cs_dark, "CTA Secondary Colors", "hover")}
        
            -- ftd.color cta-secondary-pressed-:
            light: ${get_color_value(cs_light, "CTA Secondary Colors", "pressed")}
            dark: ${get_color_value(cs_dark, "CTA Secondary Colors", "pressed")}
        
            -- ftd.color cta-secondary-disabled-:
            light: ${get_color_value(cs_light, "CTA Secondary Colors", "disabled")}
            dark: ${get_color_value(cs_dark, "CTA Secondary Colors", "disabled")}
        
            -- ftd.color cta-secondary-focused-:
            light: ${get_color_value(cs_light, "CTA Secondary Colors", "focused")}
            dark: ${get_color_value(cs_dark, "CTA Secondary Colors", "focused")}
        
            -- ftd.color cta-secondary-border-:
            light: ${get_color_value(cs_light, "CTA Secondary Colors", "border")}
            dark: ${get_color_value(cs_dark, "CTA Secondary Colors", "border")}
        
            -- ftd.color cta-secondary-text-:
            light: ${get_color_value(cs_light, "CTA Secondary Colors", "text")}
            dark: ${get_color_value(cs_dark, "CTA Secondary Colors", "text")}
        
            -- ftd.color cta-secondary-text-disabled-:
            light: ${get_color_value(cs_light, "CTA Secondary Colors", "text-disabled")}
            dark: ${get_color_value(cs_dark, "CTA Secondary Colors", "text-disabled")}
        
            -- ftd.color cta-secondary-border-disabled-:
            light: ${get_color_value(cs_light, "CTA Secondary Colors", "border-disabled")}
            dark: ${get_color_value(cs_dark, "CTA Secondary Colors", "border-disabled")}
        
         
            -- ftd.color cta-tertiary-base-:
            light: ${get_color_value(cs_light, "CTA Tertiary Colors", "base")}
            dark: ${get_color_value(cs_dark, "CTA Tertiary Colors", "base")}
        
            -- ftd.color cta-tertiary-hover-:
            light: ${get_color_value(cs_light, "CTA Tertiary Colors", "hover")}
            dark: ${get_color_value(cs_dark, "CTA Tertiary Colors", "hover")}
        
            -- ftd.color cta-tertiary-pressed-:
            light: ${get_color_value(cs_light, "CTA Tertiary Colors", "pressed")}
            dark: ${get_color_value(cs_dark, "CTA Tertiary Colors", "pressed")}
        
            -- ftd.color cta-tertiary-disabled-:
            light: ${get_color_value(cs_light, "CTA Tertiary Colors", "disabled")}
            dark: ${get_color_value(cs_dark, "CTA Tertiary Colors", "disabled")}
        
            -- ftd.color cta-tertiary-focused-:
            light: ${get_color_value(cs_light, "CTA Tertiary Colors", "focused")}
            dark: ${get_color_value(cs_dark, "CTA Tertiary Colors", "focused")}
        
            -- ftd.color cta-tertiary-border-:
            light: ${get_color_value(cs_light, "CTA Tertiary Colors", "border")}
            dark: ${get_color_value(cs_dark, "CTA Tertiary Colors", "border")}
        
            -- ftd.color cta-tertiary-text-:
            light: ${get_color_value(cs_light, "CTA Tertiary Colors", "text")}
            dark: ${get_color_value(cs_dark, "CTA Tertiary Colors", "text")}
        
            -- ftd.color cta-tertiary-text-disabled-:
            light: ${get_color_value(cs_light, "CTA Tertiary Colors", "text-disabled")}
            dark: ${get_color_value(cs_dark, "CTA Tertiary Colors", "text-disabled")}
        
            -- ftd.color cta-tertiary-border-disabled-:
            light: ${get_color_value(cs_light, "CTA Tertiary Colors", "border-disabled")}
            dark: ${get_color_value(cs_dark, "CTA Tertiary Colors", "border-disabled")}
        
            -- ftd.color cta-danger-base-:
            light: ${get_color_value(cs_light, "CTA Danger Colors", "base")}
            dark: ${get_color_value(cs_dark, "CTA Danger Colors", "base")}
        
            -- ftd.color cta-danger-hover-:
            light: ${get_color_value(cs_light, "CTA Danger Colors", "hover")}
            dark: ${get_color_value(cs_dark, "CTA Danger Colors", "hover")}
        
            -- ftd.color cta-danger-pressed-:
            light: ${get_color_value(cs_light, "CTA Danger Colors", "pressed")}
            dark: ${get_color_value(cs_dark, "CTA Danger Colors", "pressed")}
        
            -- ftd.color cta-danger-disabled-:
            light: ${get_color_value(cs_light, "CTA Danger Colors", "disabled")}
            dark: ${get_color_value(cs_dark, "CTA Danger Colors", "disabled")}
        
            -- ftd.color cta-danger-focused-:
            light: ${get_color_value(cs_light, "CTA Danger Colors", "focused")}
            dark: ${get_color_value(cs_dark, "CTA Danger Colors", "focused")}
        
            -- ftd.color cta-danger-border-:
            light: ${get_color_value(cs_light, "CTA Danger Colors", "border")}
            dark: ${get_color_value(cs_dark, "CTA Danger Colors", "border")}
        
            -- ftd.color cta-danger-text-:
            light: ${get_color_value(cs_light, "CTA Danger Colors", "text")}
            dark: ${get_color_value(cs_dark, "CTA Danger Colors", "text")}
        
            -- ftd.color cta-danger-text-disabled-:
            light: ${get_color_value(cs_light, "CTA Danger Colors", "text-disabled")}
            dark: ${get_color_value(cs_dark, "CTA Danger Colors", "text-disabled")}
        
            -- ftd.color cta-danger-border-disabled-:
            light: ${get_color_value(cs_light, "CTA Danger Colors", "border-disabled")}
            dark: ${get_color_value(cs_dark, "CTA Danger Colors", "border-disabled")}
        
        
            -- ftd.color accent-primary-:
            light: ${get_color_value(cs_light, "Accent Colors", "primary")}
            dark: ${get_color_value(cs_dark, "Accent Colors", "primary")}
        
            -- ftd.color accent-secondary-:
            light: ${get_color_value(cs_light, "Accent Colors", "secondary")}
            dark: ${get_color_value(cs_dark, "Accent Colors", "secondary")}
        
            -- ftd.color accent-tertiary-:
            light: ${get_color_value(cs_light, "Accent Colors", "tertiary")}
            dark: ${get_color_value(cs_dark, "Accent Colors", "tertiary")}
        
          
            -- ftd.color error-base-:
            light: ${get_color_value(cs_light, "Error Colors", "base")}
            dark: ${get_color_value(cs_dark, "Error Colors", "base")}
        
            -- ftd.color error-text-:
            light: ${get_color_value(cs_light, "Error Colors", "text")}
            dark: ${get_color_value(cs_dark, "Error Colors", "text")}
        
            -- ftd.color error-border-:
            light: ${get_color_value(cs_light, "Error Colors", "border")}
            dark: ${get_color_value(cs_dark, "Error Colors", "border")}
        
        
            -- ftd.color success-base-:
            light: ${get_color_value(cs_light, "Success Colors", "base")}
            dark: ${get_color_value(cs_dark, "Success Colors", "base")}
        
            -- ftd.color success-text-:
            light: ${get_color_value(cs_light, "Success Colors", "text")}
            dark: ${get_color_value(cs_dark, "Success Colors", "text")}
        
            -- ftd.color success-border-:
            light: ${get_color_value(cs_light, "Success Colors", "border")}
            dark: ${get_color_value(cs_dark, "Success Colors", "border")}
        
          
            -- ftd.color info-base-:
            light: ${get_color_value(cs_light, "Info Colors", "base")}
            dark: ${get_color_value(cs_dark, "Info Colors", "base")}
        
            -- ftd.color info-text-:
            light: ${get_color_value(cs_light, "Info Colors", "text")}
            dark: ${get_color_value(cs_dark, "Info Colors", "text")}
        
            -- ftd.color info-border-:
            light: ${get_color_value(cs_light, "Info Colors", "border")}
            dark: ${get_color_value(cs_dark, "Info Colors", "border")}
        
          
        
            -- ftd.color warning-base-:
            light: ${get_color_value(cs_light, "Warning Colors", "base")}
            dark: ${get_color_value(cs_dark, "Warning Colors", "base")}
        
            -- ftd.color warning-text-:
            light: ${get_color_value(cs_light, "Warning Colors", "text")}
            dark: ${get_color_value(cs_dark, "Warning Colors", "text")}
        
            -- ftd.color warning-border-:
            light: ${get_color_value(cs_light, "Warning Colors", "border")}
            dark: ${get_color_value(cs_dark, "Warning Colors", "border")}
        
          
            -- ftd.color custom-one-:
            light: ${get_color_value(cs_light, "Custom Colors", "one")}
            dark: ${get_color_value(cs_dark, "Custom Colors", "one")}
        
            -- ftd.color custom-two-:
            light: ${get_color_value(cs_light, "Custom Colors", "two")}
            dark: ${get_color_value(cs_dark, "Custom Colors", "two")}
        
            -- ftd.color custom-three-:
            light: ${get_color_value(cs_light, "Custom Colors", "three")}
            dark: ${get_color_value(cs_dark, "Custom Colors", "three")}
        
            -- ftd.color custom-four-:
            light: ${get_color_value(cs_light, "Custom Colors", "four")}
            dark: ${get_color_value(cs_dark, "Custom Colors", "four")}
        
            -- ftd.color custom-five-:
            light: ${get_color_value(cs_light, "Custom Colors", "five")}
            dark: ${get_color_value(cs_dark, "Custom Colors", "five")}
        
            -- ftd.color custom-six-:
            light: ${get_color_value(cs_light, "Custom Colors", "six")}
            dark: ${get_color_value(cs_dark, "Custom Colors", "six")}
        
            -- ftd.color custom-seven-:
            light: ${get_color_value(cs_light, "Custom Colors", "seven")}
            dark: ${get_color_value(cs_dark, "Custom Colors", "seven")}
        
            -- ftd.color custom-eight-:
            light: ${get_color_value(cs_light, "Custom Colors", "eight")}
            dark: ${get_color_value(cs_dark, "Custom Colors", "eight")}
        
            -- ftd.color custom-nine-:
            light: ${get_color_value(cs_light, "Custom Colors", "nine")}
            dark: ${get_color_value(cs_dark, "Custom Colors", "nine")}
        
            -- ftd.color custom-ten-:
            light: ${get_color_value(cs_light, "Custom Colors", "ten")}
            dark: ${get_color_value(cs_dark, "Custom Colors", "ten")}
        
            `;
        
        const blocks = colorsObj.split('-- ftd.color');
        const trimmedBlocks = blocks.map(block => block.trim());
        const nonEmptyBlocks = trimmedBlocks.filter(block => block.length > 0);
        const result = nonEmptyBlocks.map(block => {
          const lines = block.split('\n');
          const obj = { colors: lines[0].trim().replace(/:/g, '') };
          lines.slice(1).forEach(line => {
            const [key, value] = line.split(':');        
            obj[key.trim()] = value.trim()
          });
          return obj;
        });
            resolve(result);
        }
        catch(e){
            showWarningPopup("Error. Switching to default color scheme");  
            reject(e);
        }
        
    });   
}

window.onload = async function () { 
        readUrlParams().then((response)=>{
            console.log("readUrlParams() promise resolved");
            window.ftd.set_value(
                `admint-io.github.io/Templates/#loadedState`,
                "loaded"
            );
        }).catch(error => {
            console.log("readUrlParams() promise rejected");
            console.error("Promise rejected : readUrlParams(), Reason : ",error);
            window.ftd.set_value(
                `admint-io.github.io/Templates/#loadedState`,
                "loaded"
            );
          });  
  }

  window.readUrlParams = async function readUrlParams() {

    return new Promise(function(resolve, reject) {
        var queryString = window.location.search;  
        var queryParameters = queryString.slice(1);    
        var parametersObject = {};
    
        queryParameters.split('&').forEach(function(parameter) {
          var keyValue = parameter.split('=');
          var key = decodeURIComponent(keyValue[0]);
          var value = decodeURIComponent(keyValue[1]);
          parametersObject[key] = value;
        });
        
        var cName = parametersObject['cname'];
        var inviteId = parametersObject['invite_id'];
        creativeId = parametersObject['cd'];
        var nftType=parametersObject['type'];
        domainName=cName;
        inviteCode=inviteId;
    
        window.ftd.set_value(
            `admint-io.github.io/Templates/texts#nft-type`,
            nftType
        );
        
        console.log("cname is ",cName);
        console.log("invite id is ",inviteCode);
          
        fetchUiComponents(domainName).then((result)=>{
            console.log("fetchUiComponents() promise resolved");
            if("colorSchemeUrl" in result.values[0]){
                fetchColorScheme(result.values[0].colorSchemeUrl).then((figmaJson)=>{
                    console.log("fetchColorScheme() promise resolved");
                    figma_json_to_ftd(figmaJson).then((resultColorsObj)=>{
                        console.log("figma_json_to_ftd() promise resolved");
                        console.log("result colors object is ",resultColorsObj);  
                        console.log("starting to update ftd colors");  
                        resultColorsObj.forEach((obj)=>{
                            try{
                            var colors=obj.colors;        
                            if ("colors" in obj) {
                                delete obj["colors"];
                            }
                           if(obj.light != undefined && obj.light != "undefined"){
                            window.ftd.set_value(
                                `admint-io.github.io/Templates/colors#${colors}.light`,
                                obj.light
                            );
                           }
                           if(obj.dark != undefined && obj.dark != "undefined"){
                            window.ftd.set_value(
                                `admint-io.github.io/Templates/colors#${colors}.dark`,
                                obj.dark
                            );
                           }   
    
                            }
                            catch(e){console.error(e);}
                        }); 
    
                        console.log("ftd colors updated");  
                    }).catch(error => {
                        console.log("figma_json_to_ftd() promise rejected");
                        console.error("Promise rejected : figma_json_to_ftd(), Reason : ",error);
                      });           
                }).catch(error => {
                    console.log("fetchColorScheme() promise rejected");
                    console.error("Promise rejected : fetchColorScheme(), Reason : ",error);
                  });   
            }
            else{
                reject("color scheme url key not included");
            }
            resolve(result);
        }).catch(error => {
            console.log("fetchUiComponents() promise resolved");
            console.error("Promise rejected : fetchUiComponents(), Reason : ",error);
            reject(error);
          });          
    });

   
  }

  window.fetchUiComponents = async function fetchUiComponents(domainName) {
    return new Promise(function(resolve, reject) {
        if(domainName != undefined){
            const url = `${config.DISTRIBUTION_BASE_BACKEND_URL}/sitedata/${domainName}`;
            const apiConfig = {
                headers: {
                  "Content-Type": "application/json"
                }
              };
            axios
            .get(url, apiConfig)
            .then((response) => {
                const respData = response.data;        
                if("values" in respData){   
                    if(respData.values.length>0){
                        if("campaignId" in respData.values[0]){
                            campaignId=respData.values[0].campaignId;
                        } 
                        if("bannerImageUrl" in respData.values[0]){
                            window.ftd.set_value(
                                "admint-io.github.io/Templates/images#hero-image-url",
                                respData.values[0].bannerImageUrl
                            );
                        } 
                        if("creativeDatas" in respData.values[0]){
                            updateCreativeDataUi(respData.values[0].creativeDatas).then((result)=>{
                                window.ftd.set_value(
                                    `admint-io.github.io/Templates/#loadedState`,
                                    "loaded"
                                );
                            });
                        }
                        resolve(respData);
                    }   
                    else{
                        reject("values is an empty array");
                    }                          
                }
                else{
                    reject("values key not included in response from server")
                }   
            })
            .catch((error) => {
                console.error(error);
                showFailurePopup(error);
                reject(error);
            });
        }
        else{
            reject("domain name is undefined");
        }
      
      });
  }  

window.fetchColorScheme = async function fetchColorScheme(colorSchemeUrl) {
    return new Promise(async (resolve, reject) => {
        const url=`${config.COLOR_SCHEME_BASE_URL}/${colorSchemeUrl}`;
        const apiConfig = {
            headers: {
              "Content-Type": "application/json",
            },
          };
        axios
        .get(url, apiConfig)
        .then((response) => {
            const respData=response.data;
            if (isValidJSON(respData)) {
                const respDataString=JSON.stringify(respData);
                resolve(respDataString);
              } else {
                reject("invalid JSON");
              }
        })
        .catch((error) => {
            console.error(error);                  
            showFailurePopup(error);
            reject(error);
        });
    });            
}

window.updateCreativeDataUi = async function updateCreativeDataUi(creativeDatasArray) {
    return new Promise(async (resolve, reject) => {
        console.log("creative datas array is ",creativeDatasArray,"creative id is ",creativeId);
        creativeDatasArray.forEach((obj)=>{
            if(obj.creativeId==creativeId){
                if("imageUrl" in obj){
                    window.ftd.set_value(
                        "admint-io.github.io/Templates/images#nft-image-url",
                        obj.imageUrl
                    );                    
                }            
            }
        });
        resolve("nft image updation success");
    });    
}

window.isValidJSON = async function isValidJSON(response) {
    try {
        JSON.parse(response);
        return true;
      } catch (error) {
        return false;
      }
}

window.showSuccessPopup=async function showSuccessPopup(inputData) {
    console.log("input data is ",inputData);
   
    const overlay = document.createElement('div');
    const popup = document.createElement('div');
    const popupStyle = document.createElement("style"); 
    const submitButtonContainer=document.createElement("div");
    const submitButton = document.createElement('button');
    const imageContainer = document.createElement('div');      
    const statusImage = new Image();
    const titleContainer = document.createElement('div'); 
    const tileText = document.createElement("h2");
    const messageContainer = document.createElement('div'); 
    const messageText = document.createElement("h4");
  
    submitButton.textContent = 'Close';   
  
    popupStyle.textContent = `
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      opacity: 0;
      transition: opacity 0.5s;
    }
    .popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      padding: 20px;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.5s;
      border-radius: 20px; 
      width: 470px;
      height: 350px;
      flex-direction: row;
      align-items: flex-end;
    }
    .submitButtonContainer {
      width: 224px;
      height: 46px;
      position: fixed;
      bottom: 0;
      margin-left: 120px;
      background: #3FB488;
      border: 0.891775px solid #FFFFFF;
      border-radius: 8.91775px;
      margin-bottom: 15px;
    }
    .submitButton {
      width: 224px;
      height: 46px;
      background: #3FB488;
      border: 0.891775px solid #FFFFFF;
      border-radius: 8.91775px;
      font-family: 'Lato', sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 14.2684px;
      line-height: 17px;
      color: #FFFFFF;
      cursor: pointer;
    }
    .imageContainer {
        
    }
    .statusImage {

    }
    .titleContainer {
        margin-top:20px;
    }
    .tileText {
        font-family: 'Lato', sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 25px;
        line-height: 17px;
    }
    .messageContainer {

    }
    .messageText {
        font-family: 'Lato', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 15.2684px;
        line-height: 17px;
    }
    `;
  
    overlay.id="overlay";
    popup.id="popup";
    submitButtonContainer.id="submitButtonContainer";
    submitButton.id="submitButton";
    imageContainer.id="imageContainer";
    statusImage.id="statusImage";
    titleContainer.id="titleContainer";
    tileText.id="tileText";
    messageContainer.id="messageContainer";
    messageText.id="messageText";
  
    overlay.classList.add("overlay");
    popup.classList.add("popup");
    submitButtonContainer.classList.add("submitButtonContainer");
    submitButton.classList.add("submitButton");
    imageContainer.classList.add("imageContainer");
    statusImage.classList.add("statusImage");   
    titleContainer.classList.add("titleContainer");
    tileText.classList.add("tileText");
    messageContainer.classList.add("messageContainer");
    messageText.classList.add("messageText");

   // statusImage.src="https://png.pngtree.com/png-vector/20221215/ourmid/pngtree-green-check-mark-png-image_6525691.png";
    statusImage.src="./images/liveTick.gif";
    statusImage.style.width="200px";
    statusImage.style.height="150px";  
  
    imageContainer.style.alignItems="center";
  //  imageContainer.style.backgroundColor="yellow";
    imageContainer.style.alignContent="center";
    imageContainer.style.textAlign="center";

    titleContainer.style.textAlign="center";
   // titleContainer.style.backgroundColor="orange";

    tileText.innerText="Success";
    tileText.style.color="#339e5f";

  //  messageContainer.style.backgroundColor="blue";
    messageContainer.style.textAlign="center";

    messageText.innerText="You have claimed your NFT. Now sit back and relax, while we do our part !";
    messageText.style.marginTop="30px";
  
    imageContainer.appendChild(statusImage);
    titleContainer.appendChild(tileText);
    messageContainer.appendChild(messageText);
    popup.appendChild(imageContainer);
    popup.appendChild(titleContainer);
    popup.appendChild(messageContainer);
   
  
    submitButton.addEventListener("click", () => {
        overlay.style.opacity = '0';
        popup.style.opacity = '0';
    
        setTimeout(() => {
          document.body.removeChild(overlay);
          document.body.removeChild(popup);
        }, 500);  
     });
  
    submitButtonContainer.appendChild(submitButton);
    popup.appendChild(submitButtonContainer);
    popup.appendChild(popupStyle);
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
  
    setTimeout(() => {
      overlay.style.opacity = '1';
      popup.style.opacity = '1';
    }, 50);
  }

  window.showFailurePopup=async function showFailurePopup(inputData) {
    console.log("input data is ",inputData);
   
    const overlay = document.createElement('div');
    const popup = document.createElement('div');
    const popupStyle = document.createElement("style"); 
    const submitButtonContainer=document.createElement("div");
    const submitButton = document.createElement('button');
    const imageContainer = document.createElement('div');      
    const statusImage = new Image();
    const titleContainer = document.createElement('div'); 
    const tileText = document.createElement("h2");
    const messageContainer = document.createElement('div'); 
    const messageText = document.createElement("h4");
  
    submitButton.textContent = 'Close';   
  
    popupStyle.textContent = `
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      opacity: 0;
      transition: opacity 0.5s;
    }
    .popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      padding: 20px;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.5s;
      border-radius: 20px; 
      width: 470px;
      height: 350px;
      flex-direction: row;
      align-items: flex-end;
    }
    .submitButtonContainer {
      width: 224px;
      height: 46px;
      position: fixed;
      bottom: 0;
      margin-left: 120px;
      background: #3FB488;
      border: 0.891775px solid #FFFFFF;
      border-radius: 8.91775px;
      margin-bottom: 15px;
    }
    .submitButton {
      width: 224px;
      height: 46px;
      background: #d13b4e;
      border: 0.891775px solid #FFFFFF;
      border-radius: 8.91775px;
      font-family: 'Lato', sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 14.2684px;
      line-height: 17px;
      color: #FFFFFF;
      cursor: pointer;
    }
    .imageContainer {
        
    }
    .statusImage {

    }
    .titleContainer {
        margin-top:20px;
    }
    .tileText {
        font-family: 'Lato', sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 25px;
        line-height: 17px;
    }
    .messageContainer {

    }
    .messageText {
        font-family: 'Lato', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 15.2684px;
        line-height: 17px;
    }
    `;
  
    overlay.id="overlay";
    popup.id="popup";
    submitButtonContainer.id="submitButtonContainer";
    submitButton.id="submitButton";
    imageContainer.id="imageContainer";
    statusImage.id="statusImage";
    titleContainer.id="titleContainer";
    tileText.id="tileText";
    messageContainer.id="messageContainer";
    messageText.id="messageText";
  
    overlay.classList.add("overlay");
    popup.classList.add("popup");
    submitButtonContainer.classList.add("submitButtonContainer");
    submitButton.classList.add("submitButton");
    imageContainer.classList.add("imageContainer");
    statusImage.classList.add("statusImage");   
    titleContainer.classList.add("titleContainer");
    tileText.classList.add("tileText");
    messageContainer.classList.add("messageContainer");
    messageText.classList.add("messageText");

   // statusImage.src="https://png.pngtree.com/png-vector/20221215/ourmid/pngtree-green-check-mark-png-image_6525691.png";
    //statusImage.src="./images/liveTick.gif";
    statusImage.src="https://media4.giphy.com/media/G9FMEr3PGv2pfc1Z5F/giphy.gif?cid=6c09b952vwbjlggnoa5dxsf6ze7916nuncnes8vp1j6tnhkd&ep=v1_stickers_related&rid=giphy.gif&ct=s";
    statusImage.style.width="200px";
    statusImage.style.height="170px";  
  
    imageContainer.style.alignItems="center";
  //  imageContainer.style.backgroundColor="yellow";
    imageContainer.style.alignContent="center";
    imageContainer.style.textAlign="center";

    titleContainer.style.textAlign="center";
   // titleContainer.style.backgroundColor="orange";

    tileText.innerText="Message";
    tileText.style.color="#fa1e3b";

  //  messageContainer.style.backgroundColor="blue";
    messageContainer.style.textAlign="center";

    if(1){
        messageText.innerText="NFT already claimed !";
    }
   
    messageText.style.marginTop="30px";
  
    imageContainer.appendChild(statusImage);
    titleContainer.appendChild(tileText);
    messageContainer.appendChild(messageText);
    popup.appendChild(imageContainer);
    popup.appendChild(titleContainer);
    popup.appendChild(messageContainer);
   
  
    submitButton.addEventListener("click", () => {
        overlay.style.opacity = '0';
        popup.style.opacity = '0';
    
        setTimeout(() => {
          document.body.removeChild(overlay);
          document.body.removeChild(popup);
        }, 500);  
     });
  
    submitButtonContainer.appendChild(submitButton);
    popup.appendChild(submitButtonContainer);
    popup.appendChild(popupStyle);
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
  
    setTimeout(() => {
      overlay.style.opacity = '1';
      popup.style.opacity = '1';
    }, 50);
  }

  window.showWarningPopup=async function showWarningPopup(inputData) {
    console.log("input data is ",inputData);
   
    const overlay = document.createElement('div');
    const popup = document.createElement('div');
    const popupStyle = document.createElement("style"); 
    const submitButtonContainer=document.createElement("div");
    const submitButton = document.createElement('button');
    const imageContainer = document.createElement('div');      
    const statusImage = new Image();
    const titleContainer = document.createElement('div'); 
    const tileText = document.createElement("h2");
    const messageContainer = document.createElement('div'); 
    const messageText = document.createElement("h4");
  
    submitButton.textContent = 'Close';   
  
    popupStyle.textContent = `
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      opacity: 0;
      transition: opacity 0.5s;
    }
    .popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      padding: 20px;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.5s;
      border-radius: 20px; 
      width: 470px;
      height: 350px;
      flex-direction: row;
      align-items: flex-end;
    }
    .submitButtonContainer {
      width: 224px;
      height: 46px;
      position: fixed;
      bottom: 0;
      margin-left: 120px;
      background: #3FB488;
      border: 0.891775px solid #FFFFFF;
      border-radius: 8.91775px;
      margin-bottom: 15px;
    }
    .submitButton {
      width: 224px;
      height: 46px;
      background: #f29f11;
      border: 0.891775px solid #FFFFFF;
      border-radius: 8.91775px;
      font-family: 'Lato', sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 14.2684px;
      line-height: 17px;
      color: #FFFFFF;
      cursor: pointer;
    }
    .imageContainer {
        
    }
    .statusImage {

    }
    .titleContainer {
        margin-top:20px;
    }
    .tileText {
        font-family: 'Lato', sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 25px;
        line-height: 17px;
    }
    .messageContainer {
        margin-top: 60px;
    }
    .messageText {
        font-family: 'Lato', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 15.2684px;
        line-height: 17px;
    }
    `;
  
    overlay.id="overlay";
    popup.id="popup";
    submitButtonContainer.id="submitButtonContainer";
    submitButton.id="submitButton";
    imageContainer.id="imageContainer";
    statusImage.id="statusImage";
    titleContainer.id="titleContainer";
    tileText.id="tileText";
    messageContainer.id="messageContainer";
    messageText.id="messageText";
  
    overlay.classList.add("overlay");
    popup.classList.add("popup");
    submitButtonContainer.classList.add("submitButtonContainer");
    submitButton.classList.add("submitButton");
    imageContainer.classList.add("imageContainer");
    statusImage.classList.add("statusImage");   
    titleContainer.classList.add("titleContainer");
    tileText.classList.add("tileText");
    messageContainer.classList.add("messageContainer");
    messageText.classList.add("messageText");

   // statusImage.src="https://png.pngtree.com/png-vector/20221215/ourmid/pngtree-green-check-mark-png-image_6525691.png";
    statusImage.src="data:image/png;base64,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";
    statusImage.style.width="120px";
    statusImage.style.height="120px";  
  
    imageContainer.style.alignItems="center";
  //  imageContainer.style.backgroundColor="yellow";
    imageContainer.style.alignContent="center";
    imageContainer.style.textAlign="center";

    titleContainer.style.textAlign="center";
   // titleContainer.style.backgroundColor="orange";

    tileText.innerText="Warning";
    tileText.style.color="#ffa203";

  //  messageContainer.style.backgroundColor="blue";
    messageContainer.style.textAlign="center";

    messageText.innerText=inputData;
    messageText.style.marginTop="30px";
  
    imageContainer.appendChild(statusImage);
    titleContainer.appendChild(tileText);
    messageContainer.appendChild(messageText);
    popup.appendChild(imageContainer);
    popup.appendChild(titleContainer);
    popup.appendChild(messageContainer);
   
  
    submitButton.addEventListener("click", () => {
        overlay.style.opacity = '0';
        popup.style.opacity = '0';
    
        setTimeout(() => {
          document.body.removeChild(overlay);
          document.body.removeChild(popup);
        }, 500);  
     });
  
    submitButtonContainer.appendChild(submitButton);
    popup.appendChild(submitButtonContainer);
    popup.appendChild(popupStyle);
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
  
    setTimeout(() => {
      overlay.style.opacity = '1';
      popup.style.opacity = '1';
    }, 50);
  }