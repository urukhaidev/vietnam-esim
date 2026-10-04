import {catalog} from './plans.js';
import {card} from './render.mjs';
import {matches,quote} from './filter.mjs';
const $=id=>document.getElementById(id);
let type='all';
const volumes=[...$('gb').options].map(o=>o.value);
$('gb-range').max=volumes.length-1;
const filters={type:'all',days:'',gb:''};
const grid=$('plans');
function render(reset=true){
  if(!$('days').checkValidity()){$('days').reportValidity();return;}
  filters.type=type;filters.days=$('days').value;filters.gb=$('gb').value;
  const trip=Number(filters.days)||7;
  const list=catalog.plans.filter(p=>matches(p,filters));
  const sort=$('sort').value;
  list.sort((a,b)=>sort==='data'?((b.type==='unlimited'?Infinity:b.mb)-(a.type==='unlimited'?Infinity:a.mb)||quote(a,trip)-quote(b,trip)):sort==='duration'?(b.duration.configurable?trip:b.days)-(a.duration.configurable?trip:a.days)||quote(a,trip)-quote(b,trip):quote(a,trip)-quote(b,trip)||b.days-a.days);
  grid.innerHTML=list.map(p=>card(p,trip)).join('');
  $('result-count').textContent=`Найдено тарифов: ${list.length}`;
  $('empty').hidden=!!list.length;
  $('gb').disabled=type==='unlimited';
  $('gb-range').disabled=type==='unlimited';
  document.querySelectorAll('[data-days]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.days===filters.days)));
  $('volume-control').hidden=type==='unlimited';
  $('unlimited-hint').hidden=type!=='unlimited';
  $('gb-range').value=Math.max(0,volumes.indexOf(filters.gb));
  $('gb-range').setAttribute('aria-valuetext',$('gb').selectedOptions[0].textContent);
  $('gb-value').textContent=$('gb').selectedOptions[0].textContent;
}
function reset(){type='all';$('days').value='';$('gb').value='';$('sort').value='price';updateTabs();render();}
function updateTabs(){document.querySelectorAll('[data-type]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.type===type)));}
document.querySelectorAll('[data-type]').forEach(b=>b.addEventListener('click',()=>{type=b.dataset.type;if(type==='unlimited') $('gb').value='';updateTabs();render();}));
['days','gb','sort'].forEach(id=>$(id).addEventListener('change',()=>render()));
$('days').addEventListener('input',()=>{if($('days').checkValidity()) render();});
$('reset').addEventListener('click',reset);$('empty-reset').addEventListener('click',reset);
document.querySelectorAll('[data-days]').forEach(b=>b.addEventListener('click',()=>{$('days').value=b.dataset.days;render();}));
$('gb-range').addEventListener('input',()=>{$('gb').value=volumes[Number($('gb-range').value)];render();});
$('filters').hidden=false;
render();
