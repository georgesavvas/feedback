import BrowserOnly from '@docusaurus/BrowserOnly';

const SafeKanban = props => {
  return (
    <BrowserOnly>
      {() => {
        const Kanban = require("./Kanban").Kanban;
        return <Kanban {...props} />;
      }}
    </BrowserOnly>
  );
};

export default SafeKanban;
