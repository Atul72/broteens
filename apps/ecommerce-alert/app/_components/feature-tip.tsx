import Icon, { IconName } from "./icon";

export default function FeatureTip({
  icon,
  title,
  description,
}: {
  icon: IconName;
  title: string;
  description: string;
}) {
  return (
    <div className="mt-[18px] flex gap-[13px]">
      <span className="grid h-[33px] w-[33px] shrink-0 place-items-center rounded-[9px] bg-[#f4f6fa]">
        <Icon name={icon} className="h-[17px] w-[17px]" />
      </span>
      <div>
        <strong className="text-xs">{title}</strong>
        <p className="mt-1 text-[11px] leading-5 text-[#65718a]">
          {description}
        </p>
      </div>
    </div>
  );
}
