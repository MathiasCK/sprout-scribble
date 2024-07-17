export const betweenWeeks = (
  dateToCheck: Date,
  betweenDate1: number,
  betweenDate2: number
) => {
  const today = new Date();

  const targetDate1 = new Date(today);
  const targetDate2 = new Date(today);

  targetDate1.setDate(targetDate1.getDate() - betweenDate1);
  targetDate2.setDate(targetDate2.getDate() - betweenDate2);

  return dateToCheck >= targetDate1 && dateToCheck <= targetDate2;
};

export const monthlyChart = (chartItems: { date: Date; revenue: number }[]) => {
  return [
    {
      date: "3 weeks ago",
      revenue: chartItems
        .filter(order => betweenWeeks(order.date!, 28, 21))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "2 weeks ago",
      revenue: chartItems
        .filter(order => betweenWeeks(order.date!, 21, 14))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "1 week ago",
      revenue: chartItems
        .filter(order => betweenWeeks(order.date!, 14, 7))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "this week",
      revenue: chartItems
        .filter(order => betweenWeeks(order.date!, 7, 0))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
  ];
};
