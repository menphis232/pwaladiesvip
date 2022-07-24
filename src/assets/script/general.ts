export function SoloNumero (evt:any){
    var code =  evt.keyCode;
    if(code==8) { // backspace.
        return true;
    } else if(code>=48 && code<=57) { // is a number.
        return true;
    } else{ // other keys.
        return false;
    }
}

export function SoloNumeroPrecio (e:any){
    if( !( e.keyCode >= 96 && e.keyCode <= 105 ) && (e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 8  && e.keyCode != 190  && e.keyCode !=110  && e.keyCode !=188) {
       return  e.preventDefault();
    }
}

export function SoloLetra(evt:any){
    var code =  evt.keyCode;
    if(code==8) { // backspace.
        return true;
    } else if((code >= 65 && code<= 90) || (code >= 97 && code<= 122)) { // is a number.
        return true;
    } else{ // other keys.
        return false;
    }
}

export  function Vacio(datas:any){
    let res:boolean = false;
    for (const [key, value] of Object.entries(datas)) {
        if((value == '' || value == null) && value != 0 ){
            // console.log(key);
            res = true;
            break;
        }else{
            if(value){
                res = false;
            }else{
                res = true;
            }
        }
    }
    return res;
}

export  function VacioU(datas:any){

    let res = false;
    if((datas == '' || datas == null) && datas != 0 ){
        res = true;
    }else{
        if(datas){
            res = false;
        }else{
            res = true;
        }
    }
    return res;
}

export function CrearFecha(){
    let fecha = new Date();
    let fecha_hoy:any = null;
    fecha_hoy += fecha.getFullYear();
    if((fecha.getMonth()+1 )<10){
        fecha_hoy +="-"+'0'+(fecha.getMonth()+1 )
    }else{
        fecha_hoy +="-"+(fecha.getMonth()+1 )
    }

    if(fecha.getDate()<10){
        fecha_hoy +="-"+'0'+fecha.getDate()
    }else{
        fecha_hoy +="-"+fecha.getDate()
    }
    return fecha_hoy
}

