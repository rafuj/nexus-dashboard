import { Helmet } from "react-helmet-async";
import ManageCabinet from "../components/ManageCabinet";


const CabinetView = () => {

  return (
    <>
      <Helmet>
        <title>Cabinets Information | Updaid</title>
      </Helmet>

      <ManageCabinet className="mt-6 md:pl-5" />
    </>

  );
};

export default CabinetView;