type StatCardProps = {
  label: string;
  value: number | string;
  icon?: JSX.Element;
  color: string;
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color,
}) => (
  <div className={`rounded-xl p-6 text-${color}-700 bg-${color}-100 w-full`}>
    <div className="text-sm font-medium">{label}</div>
    <div className="text-4xl font-bold mt-2 flex items-center gap-2">
      {icon}
      {value}
    </div>
  </div>
);
