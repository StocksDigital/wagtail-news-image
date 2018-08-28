import { Component } from 'react'
const { AtomicBlockUtils } = window.DraftJS


// The source gathers data for new entities that are being added in the Draftail editor
// It is invoked only when an new embed is inserted by the user
export default class ImageSource extends Component {

    componentDidMount() {
        const { editorState, entityType, onComplete } = this.props;

        const content = editorState.getCurrentContent();
        const contentWithEntity = content.createEntity(entityType.type, 'MUTABLE', {
          id: null,
          title: null,
          href: null,
          alt: null,
          width: null,
        });
        const entityKey = contentWithEntity.getLastCreatedEntityKey();
        const nextState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
        onComplete(nextState);
    }

    render() {
        return null;
    }
}
