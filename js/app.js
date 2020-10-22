const form = document.querySelector('.form-agregar-tarea')
const lista = document.querySelector('.listado-de-tareas')

const agregarTarea = (e) => {
  e.preventDefault()
  let nomTarea = document.querySelector('#nomTarea').value
  let checkboxes = document.querySelectorAll("input[name='etiquetas']:checked")
  let valores = []
  checkboxes.forEach((checkbox)=>{
    valores.push(checkbox.value)
  })
  let guardar = {
    tarea: nomTarea,
    etiquetas: valores
  }
  lista.appendChild(crearLi(guardar,obtenerTareasLS().length))
  agregarTareaLS(guardar)
  e.target.reset()
}
const agregarTareaLS = (tarea) =>{
  let tareas = obtenerTareasLS()
  tareas.push(tarea)
  localStorage.setItem('tareas', JSON.stringify(tareas))
}
const crearLi = (tarea, index) => {
  let tareas = obtenerTareasLS()
  let nuevaTarea = tarea.tarea
  let etiquetas = tarea.etiquetas
  let li = document.createElement('li')
  li.className = 'tarea'
  if(tareas.length == 0){
    li.setAttribute('data-id', 1)
  }else{
    li.setAttribute('data-id', index+1)
  }
  let span = document.createElement('span')
  span.className = 'tarea-span'
  span.appendChild(document.createTextNode(nuevaTarea))
  li.appendChild(span)
  let botones = document.createElement('div')
  botones.className = 'etiquetas-botones' 
  etiquetas.forEach((etiqueta)=>{
    let btnSpan = document.createElement('span')
    btnSpan.className = `btn btn-${etiqueta}`
    btnSpan.appendChild(document.createTextNode(etiqueta))
    botones.appendChild(btnSpan)
  })
  let btnEliminar = document.createElement('button')
  btnEliminar.className = 'btn btn-eliminar'
  btnEliminar.appendChild(document.createTextNode('X'))
  botones.appendChild(btnEliminar)
  li.appendChild(botones)
  return li
}
const obtenerTareasLS = () => {
  let tareas = 0
  if(localStorage.getItem('tareas') == null){
    tareas = []
  }else{
    tareas = JSON.parse(localStorage.getItem('tareas'))
  }
  return tareas
}
const localStorageListo = () => {
  let tareas = obtenerTareasLS()
  let orden = localStorage.getItem('orden-tareas').split('-')
  let aux = []
  for(let i = 0 ; i < orden.length ; i++){
    for(let j = 0 ; j < tareas.length ; j++){
      if(orden[i]==(j+1)){
        aux.push(tareas[j])
      }
    }
  }
  if(orden != "" && orden.length >= 2){
    aux.forEach((item,index)=>{
      lista.appendChild(crearLi(item,index))
    })
    localStorage.setItem('tareas', JSON.stringify(aux))
  }else{
    tareas.forEach((tarea,index)=>{
      lista.appendChild(crearLi(tarea,index))
    })
  }
  localStorage.setItem('orden-tareas','')
}
const eliminarItemLS = (tarea) => {
  let tareas, tareaBorrar
  tareas = obtenerTareasLS()
  tareaBorrar = tarea.wholeText
  tareas.forEach((item,index)=>{
    if(tareaBorrar == item.tarea){
      tareas.splice(index,1)
    }
  })
  // console.log(tareas)
  localStorage.setItem('tareas', JSON.stringify(tareas))

}
const eliminarItem = (e) => {
  e.preventDefault()
  let btn = e.target
  let li
  if(btn.classList.contains('btn-eliminar')){
    li = btn.parentElement.parentElement
    if(confirm(`¿Seguro que desea eliminar el elemento?`)){
      eliminarItemLS(li.querySelector('.tarea-span').firstChild)
      lista.removeChild(li)
    }
  }
}
form.addEventListener('submit', agregarTarea)
lista.addEventListener('click', eliminarItem)
document.addEventListener('DOMContentLoaded', localStorageListo)

/* Drag and Drop */
Sortable.create(lista,{
  animation:150,
  chosenClass: 'seleccionado',
  // ghostClass: 'fantasma'
  dragClass: 'drag',
  onEnd: () => {
    console.log('Se inserto un elemento')
  },
  group: 'orden-tareas',
  store: {
    // Guadamos el orden de la lista
    set: (sortable) => {
      const orden = sortable.toArray()
      localStorage.setItem(sortable.options.group.name ,orden.join('-'))
    },
    // Obtenemos el orden de la lista
    get: (sortable) => {
      const orden = localStorage.getItem(sortable.options.group.name)
      return orden ? orden.split('-') : []
    }
  }
})