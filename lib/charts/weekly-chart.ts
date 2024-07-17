export const checkDate = (dateToCheck: Date, daysAgo: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(today);

  targetDate.setDate(targetDate.getDate() - daysAgo);

  return (
    dateToCheck.getDate() === targetDate.getDate() &&
    dateToCheck.getMonth() === targetDate.getMonth() &&
    dateToCheck.getFullYear() === targetDate.getFullYear()
  );
};

export const weeklyChart = (chartItems: { date: Date; revenue: number }[]) => {
  return [
    {
      date: "6d ago",
      revenue: chartItems
        .filter(order => checkDate(order.date, 6))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "5d ago",
      revenue: chartItems
        .filter(order => checkDate(order.date, 5))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "4d ago",
      revenue: chartItems
        .filter(order => checkDate(order.date, 4))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "3d ago",
      revenue: chartItems
        .filter(order => checkDate(order.date, 3))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "2d ago",
      revenue: chartItems
        .filter(order => checkDate(order.date, 2))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "1d ago",
      revenue: chartItems
        .filter(order => checkDate(order.date, 1))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "today",
      revenue: chartItems
        .filter(order => checkDate(order.date, 0))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
  ];
};
