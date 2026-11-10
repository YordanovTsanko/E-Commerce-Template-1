// Бекендът връща част от съобщенията на английски — тук ги превеждаме,
// за да вижда потребителят ясни български текстове.
const DICTIONARY = [
  [/incorrect (email|password)/i, "Грешен имейл или парола."],
  [/missing credentials/i, "Моля, въведете имейл и парола."],
  [/login failed/i, "Входът не беше успешен. Опитайте отново."],
  [/user already exists/i, "Вече има регистрация с този имейл."],
  [/all fields are required/i, "Моля, попълнете всички задължителни полета."],
  [/password must be at least 8/i, "Паролата трябва да е поне 8 символа и да съдържа главна буква, малка буква и специален символ."],
  [/please write new password/i, "Въведете нова парола и я потвърдете."],
  [/new password and confirm password do not match/i, "Новата парола и потвърждението не съвпадат."],
  [/current password is incorrect/i, "Текущата парола е грешна."],
  [/email already exists/i, "Този имейл вече се използва от друг профил."],
  [/please log in first/i, "Моля, влезте в профила си, за да продължите."],
  [/you must be logged in/i, "Моля, влезте в профила си, за да продължите."],
  [/not authorized/i, "Нямате права за това действие."],
  [/products not found/i, "В тази категория все още няма продукти."],
  [/product not found/i, "Продуктът не беше намерен."],
  [/category not found/i, "Такава категория не съществува."],
  [/invalid product id/i, "Невалиден идентификатор на продукт."],
  [/invalid order id/i, "Невалиден номер на поръчка."],
  [/no order found/i, "Поръчката не беше намерена."],
  [/don't have any orders/i, "Все още нямате поръчки."],
  [/error creating the new order/i, "Поръчката не можа да бъде създадена. Проверете данните за доставка."],
  [/review not found/i, "Ревюто не беше намерено."],
  [/please select rating/i, "Моля, изберете оценка."],
  [/users not found/i, "Потребителите не можаха да бъдат заредени."],
  [/description must be more/i, "Описанието трябва да е поне 200 символа."],
  [/internal server error/i, "Възникна грешка в сървъра. Опитайте отново след малко."],
  [/network error/i, "Няма връзка със сървъра. Проверете дали бекендът работи."],
];

export const translateError = (message) => {
  if (!message) return "Възникна неочаквана грешка. Опитайте отново.";
  const text = Array.isArray(message) ? message.join(" ") : String(message);
  const hit = DICTIONARY.find(([pattern]) => pattern.test(text));
  return hit ? hit[1] : text;
};
