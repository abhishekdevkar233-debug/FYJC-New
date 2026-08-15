import "./SubItemList.css";

export interface SubItem {
  name: string;
  description: string;
  tag: string;
}

interface SubItemListProps {
  title: string;
  description: string;
  items: SubItem[];
}

export function SubItemList({ title, description, items }: SubItemListProps) {
  return (
    <div className="subitem-page">
      <div className="subitem-page-head">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <ul className="subitem-list">
        {items.map((item) => (
          <li className="subitem" key={item.name}>
            <div>
              <p className="subitem-name">{item.name}</p>
              <p className="subitem-desc">{item.description}</p>
            </div>
            <span className={`subitem-tag ${item.tag === "Disabled" ? "subitem-tag--disabled" : ""}`}>
              {item.tag}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
