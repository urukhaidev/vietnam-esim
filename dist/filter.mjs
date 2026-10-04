export function quote(plan,days=1) { return plan.price*(plan.billing==='day'?days:1); }
export function matches(plan,filters) {
  if(filters.type!=='all' && plan.type!==filters.type) return false;
  if(filters.gb && (plan.type!=='fixed' || plan.mb!==Number(filters.gb))) return false;
  const days=Number(filters.days);
  if(days && (plan.duration.configurable ? days<plan.duration.minimum_days || days>plan.duration.maximum_days : plan.days<days)) return false;
  return true;
}
