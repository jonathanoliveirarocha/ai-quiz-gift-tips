import { Composition, Folder, Still } from "remotion";
import { MimoCertoReels } from "./MimoCertoReels";
import { Cover } from "./Cover";
import { Profile } from "./Profile";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Instagram">
      <Composition
        id="MimoCertoReels"
        component={MimoCertoReels}
        durationInFrames={735}
        fps={30}
        width={1080}
        height={1920}
      />
      <Still id="Capa" component={Cover} width={1080} height={1920} />
      <Still id="Perfil" component={Profile} width={1080} height={1080} />
    </Folder>
  );
};
