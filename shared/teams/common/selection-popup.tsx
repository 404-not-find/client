import * as React from 'react'
import * as Constants from '../../constants/teams'
import * as Types from '../../constants/types/teams'
import * as ChatTypes from '../../constants/types/chat2'
import * as Styles from '../../styles'
import * as Container from '../../util/container'
import * as Kb from '../../common-adapters'
import * as TeamsGen from '../../actions/teams-gen'
import {TabKey as ChannelTabKey} from '../channel/tabs'
import {pluralize} from '../../util/string'

type TeamSelectableTab = Extract<Types.TabKey, 'members' | 'channels'>
type ChannelSelectableTab = Extract<ChannelTabKey, 'members'>

type TeamActionsProps = {
  teamID: Types.TeamID
}
type TeamProps = TeamActionsProps & {
  selectedTab: TeamSelectableTab
}

type ChannelActionsProps = {
  conversationIDKey: ChatTypes.ConversationIDKey
}
type ChannelProps = ChannelActionsProps & {
  selectedTab: ChannelSelectableTab
}

type Props = TeamProps | ChannelProps

const isChannel = (props: Props): props is ChannelProps => !!(props as ChannelProps).conversationIDKey

const getTeamSelectedCount = (state: Container.TypedState, props: TeamProps) => {
  const {selectedTab, teamID} = props
  switch (selectedTab) {
    case 'channels':
      return state.teams.teamSelectedChannels.get(teamID)?.size ?? 0
    case 'members':
      return state.teams.teamSelectedMembers.get(teamID)?.size ?? 0
    default:
      return 0
  }
}

const getChannelSelectedCount = (state: Container.TypedState, props: ChannelProps) => {
  const {conversationIDKey, selectedTab} = props
  switch (selectedTab) {
    case 'members':
      return state.teams.channelSelectedMembers.get(conversationIDKey)?.size ?? 0
    default:
      return 0
  }
}

// In order for Selection Popup to show in a tab
// the respective tab needs to be added to this map
const teamSelectableTabNames: {[k in TeamSelectableTab]: string} = {
  channels: 'channel',
  members: 'member',
}
const channelSelectableTabNames: {[k in ChannelSelectableTab]: string} = {
  members: 'member',
}

type JointSelectionPopupProps = {
  children: React.ReactNode
  onUnselect: () => void
  selectableTabName: string
  selectedCount: number
}

const JointSelectionPopup = (props: JointSelectionPopupProps) => {
  const {onUnselect, selectableTabName, selectedCount, children} = props
  const onSelectableTab = !!selectableTabName
  return onSelectableTab && (!Styles.isMobile || !!selectedCount) ? (
    <Kb.Box2
      fullWidth={Styles.isMobile}
      direction={Styles.isMobile ? 'vertical' : 'horizontal'}
      alignItems="center"
      style={Styles.collapseStyles([
        styles.container,
        selectedCount && !Styles.isMobile ? styles.containerShowing : null,
      ])}
      gap={Styles.isMobile ? 'tiny' : undefined}
      className="selectionPopup"
    >
      {Styles.isMobile && (
        <Kb.Text style={styles.topLink} type="BodyPrimaryLink" onClick={onUnselect}>
          Cancel
        </Kb.Text>
      )}
      <Kb.Text type="BodySmall">
        {selectedCount} {pluralize(selectableTabName, selectedCount)} selected.{' '}
        {!Styles.isMobile && (
          <Kb.Text type="BodySmallPrimaryLink" onClick={onUnselect}>
            Unselect
          </Kb.Text>
        )}
      </Kb.Text>

      {!Styles.isMobile && <Kb.BoxGrow />}
      {children}
    </Kb.Box2>
  ) : null
}

const TeamSelectionPopup = (props: TeamProps) => {
  const {selectedTab, teamID} = props
  const selectedCount = Container.useSelector(state => getTeamSelectedCount(state, props))
  const dispatch = Container.useDispatch()

  const onUnselect = () => {
    switch (selectedTab) {
      case 'channels':
        dispatch(
          TeamsGen.createSetChannelSelected({
            channel: '',
            clearAll: true,
            selected: false,
            teamID: teamID,
          })
        )
        return
      case 'members':
        dispatch(
          TeamsGen.createTeamSetMemberSelected({
            clearAll: true,
            selected: false,
            teamID: teamID,
            username: '',
          })
        )
        return
    }
  }

  const selectableTabName = teamSelectableTabNames[selectedTab]
  const Actions = teamActionsComponent[selectedTab]
  return (
    <JointSelectionPopup
      selectableTabName={selectableTabName}
      selectedCount={selectedCount}
      onUnselect={onUnselect}
    >
      <Actions teamID={teamID} />
    </JointSelectionPopup>
  )
}

const ChannelSelectionPopup = (props: ChannelProps) => {
  const {conversationIDKey, selectedTab} = props
  const selectedCount = Container.useSelector(state => getChannelSelectedCount(state, props))
  const dispatch = Container.useDispatch()

  const onUnselect = () => {
    switch (selectedTab) {
      case 'members':
        dispatch(
          TeamsGen.createChannelSetMemberSelected({
            clearAll: true,
            conversationIDKey,
            selected: false,
            username: '',
          })
        )
        return
    }
  }

  const selectableTabName = channelSelectableTabNames[selectedTab]

  return (
    <JointSelectionPopup
      selectableTabName={selectableTabName}
      selectedCount={selectedCount}
      onUnselect={onUnselect}
    >
      <ChannelMembersActions conversationIDKey={conversationIDKey} />
    </JointSelectionPopup>
  )
}

const SelectionPopup = (props: Props) =>
  isChannel(props) ? <ChannelSelectionPopup {...props} /> : <TeamSelectionPopup {...props} />

const ActionsWrapper = ({children}) => (
  <Kb.Box2 fullWidth={Styles.isMobile} direction={Styles.isMobile ? 'vertical' : 'horizontal'} gap="tiny">
    {children}
  </Kb.Box2>
)
const TeamMembersActions = ({teamID}: TeamActionsProps) => {
  const dispatch = Container.useDispatch()
  const nav = Container.useSafeNavigation()
  const members = Container.useSelector(s => s.teams.teamSelectedMembers.get(teamID))
  const isBigTeam = Container.useSelector(s => Constants.isBigTeam(s, teamID))
  if (!members) {
    // we shouldn't be rendered
    return null
  }

  // Members tab functions
  const onAddToChannel = () =>
    dispatch(
      nav.safeNavigateAppendPayload({
        path: [{props: {teamID, usernames: [...members]}, selected: 'teamAddToChannels'}],
      })
    )
  const onEditRoles = () => {}
  const onRemoveFromTeam = () => {}

  return (
    <ActionsWrapper>
      {isBigTeam && (
        <Kb.Button
          label="Add to channels"
          mode="Secondary"
          onClick={onAddToChannel}
          fullWidth={Styles.isMobile}
        />
      )}
      <Kb.Button label="Edit role" mode="Secondary" onClick={onEditRoles} fullWidth={Styles.isMobile} />
      <Kb.Button
        label="Remove from team"
        type="Danger"
        onClick={onRemoveFromTeam}
        fullWidth={Styles.isMobile}
      />
    </ActionsWrapper>
  )
}

const TeamChannelsActions = (_: TeamActionsProps) => {
  // Channels tab functions
  const onDelete = () => {}
  return (
    <ActionsWrapper>
      <Kb.Button label="Delete" type="Danger" onClick={onDelete} fullWidth={Styles.isMobile} />
    </ActionsWrapper>
  )
}

const ChannelMembersActions = (_: ChannelActionsProps) => null

const teamActionsComponent: {[k in TeamSelectableTab]: React.ComponentType<TeamActionsProps>} = {
  channels: TeamChannelsActions,
  members: TeamMembersActions,
}

const styles = Styles.styleSheetCreate(() => ({
  container: Styles.platformStyles({
    common: {
      backgroundColor: Styles.globalColors.white,
      position: 'absolute',
    },
    isElectron: {
      ...Styles.desktopStyles.boxShadow,
      ...Styles.padding(6, Styles.globalMargins.xsmall),
      borderRadius: 4,
      bottom: -48,
      left: Styles.globalMargins.tiny,
      right: Styles.globalMargins.tiny,
    },
    isMobile: {
      ...Styles.padding(Styles.globalMargins.small),
      bottom: 0,
      shadowOffset: {height: 2, width: 0},
      shadowOpacity: 0.8,
      shadowRadius: 5,
    },
  }),
  containerShowing: {
    bottom: Styles.globalMargins.small,
  },
  topLink: {
    alignSelf: 'flex-start',
    paddingBottom: Styles.globalMargins.tiny,
  },
}))

export default SelectionPopup
