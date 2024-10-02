import Image from "next/image";

interface TemplateSelectorProps {
  onSelect: (template: string) => void;
}

const templates = [
  { id: "modern", name: "Modern", image: "/templates/modern.png" },
  { id: "classic", name: "Classic", image: "/templates/classic.png" },
  { id: "creative", name: "Creative", image: "/templates/creative.png" },
];

export default function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {templates.map((template) => (
        <div
          key={template.id}
          className="border p-4 rounded cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(template.id)}
        >
          <h3 className="text-xl font-bold mb-2">{template.name}</h3>
          <Image
            src={template.image}
            alt={`${template.name} template preview`}
            width={200}
            height={300}
            className="w-full h-auto"
          />
        </div>
      ))}
    </div>
  );
}
