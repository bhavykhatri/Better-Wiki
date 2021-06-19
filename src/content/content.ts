import "./content.scss";

module Loader{
    interface AbsolutePos{
        top: number;
        bottom: number;
    }

    interface IPosDictionary{
        [id: string] : AbsolutePos;
    }

    enum SectionState{
        Inactive = 0,
        Active = 1
    }

    var tocSectionPosition : IPosDictionary;

    export function init():void{
        if(!isTocPresent()){
            return;
        }
        document.body.classList.add('better-wiki');
        tocSectionPosition = findTocSectionsPosition();

        window.addEventListener("scroll", (event)=>{
            findAndHighlightCurrentSectionToc(event, tocSectionPosition);
        });
    }

    function findAndHighlightCurrentSectionToc(event:Event, dict : IPosDictionary):void{
        var scrollPos :number = window.scrollY + window.outerHeight/2;
        
        for(var id in dict){
            var currTop:number = dict[id].top;
            var currBottom:number = dict[id].bottom;

            if(currTop<=scrollPos && currBottom>=scrollPos){
                setTocSectionState(id, SectionState.Active);
            }
            else{
                setTocSectionState(id, SectionState.Inactive);
            }
        }
    }

    function setTocSectionState(id:string, state:SectionState):void{
        var tocLevel1Ele: NodeListOf<HTMLElement>  = document.querySelectorAll(".toclevel-1");

        for(var i=0; i< tocLevel1Ele.length; i++){
            var ele:any = tocLevel1Ele[i].querySelector("a");
            
            if("href" in ele && ele.href.split("#").pop()===id ){
                if(state===SectionState.Active){
                    tocLevel1Ele[i].classList.add("bw-active");
                }
                else if(state===SectionState.Inactive && tocLevel1Ele[i].classList.contains("bw-active")){
                    tocLevel1Ele[i].classList.remove("bw-active");
                }
            }
        }
    }

    function isTocPresent():boolean{
        var tocEle :HTMLElement = document.querySelector("#toc");

        if(!tocEle){
            return false;
        }

        return true;
    }

    function findTocSectionsPosition():IPosDictionary{
        var mainSectionsOffsetHeight:number[] = [];
        var tocLevel1Ele: NodeListOf<HTMLElement>  = document.querySelectorAll(".toclevel-1");
        var idList: string[] = [];
        var posList : AbsolutePos[] = [];
        var result: IPosDictionary = {};

        for(var i=0; i< tocLevel1Ele.length; i++){
            var ele : any  = tocLevel1Ele[i].firstElementChild;

            if("href" in ele){
                var id: string = ele.href.split("#").pop();
                idList.push(id);
                mainSectionsOffsetHeight.push(cumulativeTopOffset(document.getElementById(id)));
            } 
        }
        
        var contentBoxEle:HTMLElement = document.querySelector("#mw-content-text");
        var contentBoxHeight:number = cumulativeTopOffset(contentBoxEle) + contentBoxEle.offsetHeight;

        for(var i = 0; i<tocLevel1Ele.length; i++){
            var pos:AbsolutePos ={top:0, bottom: 0};
            pos.top = mainSectionsOffsetHeight[i];

            if(i!==tocLevel1Ele.length-1){
                pos.bottom = mainSectionsOffsetHeight[i+1] -1;
            }
            else{
                pos.bottom = contentBoxHeight;
            }

            posList.push(pos);
        }

        for(var i=0; i<idList.length; i++){
            result[idList[i]] = posList[i];
        }

        return result;
    }

    function cumulativeTopOffset (element: HTMLElement):number{
        var top = 0;
        do {
            top += element.offsetTop  || 0;
            element = <HTMLElement>element.offsetParent;
        } while(element);

        return top;
    }
}

Loader.init();