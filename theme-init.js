/* © KVES · Coach-Mass-KVES : applique le thème choisi avant l'affichage (évite un flash) */
try{var __t=JSON.parse(localStorage.getItem("coach-masse-v1")||"{}").profile.theme;if(__t==="light"||__t==="dark")document.documentElement.setAttribute("data-theme",__t)}catch(e){}
