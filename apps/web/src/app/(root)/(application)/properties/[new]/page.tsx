import { Header } from "@/components/header";
import { PropertyFormStepper } from "@/components/property-form-stepper";

const NewPropertyPage = () => {
  return (
    <>
      <Header
        title="Nova Propriedade"
        description="Crie uma nova propriedade no sistema"
      />
      <div className="container mx-auto p-6 space-y-6">
        <PropertyFormStepper mode="create" />
      </div>
    </>
  );
};

export default NewPropertyPage;
