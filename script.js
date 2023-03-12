// ==UserScript==
// @name         Moodle-menu Extension
// @namespace    http://tampermonkey.net/
// @match        https://moodle.hs-esslingen.de/moodle/*
// @version      1.0.0
// @description  Extension to add a course menu on the left side of each page for HS-Esslingen's moodle.
// @author       HSE-Codes && Heinrian
// @icon         https://moodle.hs-esslingen.de/moodle/theme/image.php/boost/theme/1676389471/favicon
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    function createCurseMenu() {
        let divCurseMenu = document.createElement("div")
        divCurseMenu.style.backgroundColor = "#f8f9fa"
        divCurseMenu.style.width = "100%"
        divCurseMenu.style.height = "calc(100vh - 60px)"
        divCurseMenu.style.marginTop = "60px"
        divCurseMenu.style.display = "flex"
        divCurseMenu.style.flexDirection = "column"
        divCurseMenu.style.borderRight = "thin solid lightgrey"

        let divCurseMenuHead = document.createElement("div")
        divCurseMenuHead.style.width = "100%"
        divCurseMenuHead.style.textAlign = "center"
        divCurseMenuHead.style.borderBottom = "thin solid lightgrey"

        let h1CurseMenuHeadContent = document.createElement("h1")
        h1CurseMenuHeadContent.textContent = "Meine Kurse"
        h1CurseMenuHeadContent.style.fontWeight = "bold"

        divCurseMenuHead.appendChild(h1CurseMenuHeadContent)
        divCurseMenu.appendChild(divCurseMenuHead)

        function appendCurses(jsonResponse) {

            for (const cours of jsonResponse.data.courses) {
                let divCurse = document.createElement("div")
                divCurse.style.width = "100%"
                divCurse.style.padding = "10px 0"
                divCurse.style.borderBottom = "1px solid lightgrey"
                divCurse.onmouseout = () => {
                    divCurse.style.backgroundColor = "transparent"
                }
                divCurse.onmouseover = () => {
                    divCurse.style.backgroundColor = "lightgrey"
                }


                let divCurseLink = document.createElement("a")
                divCurseLink.href = cours.viewurl
                divCurse.appendChild(divCurseLink)

                let divCurseContent = document.createElement("div")
                divCurseContent.textContent = cours.shortname
                divCurseContent.style.padding = "10px 0 10px 30px"

                divCurseLink.appendChild(divCurseContent)

                divCurseMenu.appendChild(divCurse)
            }
        }

        let requestDetails = {
            method: "POST",
            url: "https://moodle.hs-esslingen.de/moodle/lib/ajax/service.php?sesskey="+M.cfg.sesskey+"&info=core_course_get_enrolled_courses_by_timeline_classification",
            data: "[{\"index\":0,\"methodname\":\"core_course_get_enrolled_courses_by_timeline_classification\",\"args\":{\"offset\":0,\"limit\":0,\"classification\":\"inprogress\",\"sort\":\"shortname\",\"customfieldname\":\"\",\"customfieldvalue\":\"\"}}]",
            headers: {
                "Content-Type": "application/json"
            },
            responseType: 'json',
            onload: function(response) {
                let json = JSON.parse(response.responseText)[0]
                console.log(json)
                if (json.error === false) {
                    appendCurses(json)
                }
            }
        }
        //TODO; Store in localstorage as Cache
        GM_xmlhttpRequest(requestDetails);

        
        return divCurseMenu
    }

    function init() {
        console.log("Load Moodle Extension app")

        let divPage = document.getElementById("page");
        let divPageWrapper = document.getElementById("page-wrapper");
        let divPageMenuContent = document.getElementById("theme_boost-drawers-courseindex");
        if (divPageMenuContent) {
            divPageMenuContent.style.marginLeft = "calc(12% + 2px)"
        }

        divPageWrapper.removeChild(divPage)

        let divFlexRow = document.createElement("div")
        divFlexRow.style.display = "flex"

        let divFlexItemCurseMenu = document.createElement("div")
        divFlexItemCurseMenu.style.flex = "12%"
        divFlexItemCurseMenu.appendChild(createCurseMenu())

        let divFlexItemContent = document.createElement("div")
        divFlexItemContent.style.flex = "88%"
        divFlexItemContent.appendChild(divPage)

        divFlexRow.appendChild(divFlexItemCurseMenu)
        divFlexRow.appendChild(divFlexItemContent)

        divPageWrapper.appendChild(divFlexRow)
    }

    init();
})();
