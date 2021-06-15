import "./content.scss";

module Loader{

    export function init():void{
        if(isTocPresent()){
            document.body.classList.add('better-wiki');
        }
    }

    function isTocPresent():boolean{
        var tocEle = document.querySelector("#toc");

        if(!tocEle){
            return false;
        }

        return true;
    }
}

Loader.init();