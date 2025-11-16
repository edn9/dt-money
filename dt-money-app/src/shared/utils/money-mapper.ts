export const moneyMapper = (value: number) => {
  return value.toLocaleString("pt-br", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency",
    currency: "BRL",
  });
};

//Ao inves de value.toFixed(2).replace(".", ","), usamos o toLocaleString 
// que ja faz toda a formatação de acordo com a localidade
