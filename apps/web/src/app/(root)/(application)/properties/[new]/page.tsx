import { Header } from "@/components/header";
import { PropertiesForm } from "../components/properties-form";

const NewPropertyPage = () => {
  return (
    <div className="space-y-6">
      <Header
        title="Nova Propriedade"
        description="Crie uma nova propriedade no sistema"
      />

      <div className="container mx-auto p-6 space-y-6">
        <PropertiesForm mode="create" />
      </div>
    </div>
  );
};

export default NewPropertyPage;
