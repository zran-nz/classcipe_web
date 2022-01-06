<template>
  <div class="rubric" @click="handleUpdateHeader">
    <table class="rubric-table">
      <thead>
        <!--编辑允许修改变动-->
        <draggable
          v-model="headers"
          tag="tr"
          :disabled="disabledDraggable"
          class="table-header"
          @end="handleDragEnd"
          v-if="mode === this.tableMode.Edit">
          <th
            v-for="(header, hIndex) in headers"
            :class="{'header-item': true, 'preview-mode': formTableMode === tableMode.Preview, 'min-header-width': [
              headerType.Novice,
              headerType.Learner,
              headerType.Practitoner,
              headerType.Expert,
            ].indexOf(header.type) !== -1}"
            :key="header.type"
            :data-header-type="header.type"
            :data-header-mode="formTableMode"
            v-if="!(header.type === headerType.Evidence && !(mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate))">
            <!-- 表头文本-->
            <div @click.stop="handleEditHeader(header)" class="label-text">

              <span class="header-label">{{ header.label }}</span>
              <template v-if="header.type === headerType.Novice">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students are introduced to the skills, and can watch others performing it(observation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if="header.type === headerType.Learner">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students copy others who use the skill and use the skill with scaffolding and guidance(emulation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if="header.type === headerType.Practitoner">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students employ the skill confidently and effectively(demonstration)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if="header.type === headerType.Expert">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students can show others how to use the skill and accurately assess how effectively the skill is
                    used(self-regulation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

            </div>
            <!-- 编辑状态下的输入框-->
            <template v-if="header.editing">
              <div class="label-input">
                <input
                  v-model="header.label"
                  @click.stop
                  @blur="handleUpdateHeader"
                  @keyup.enter="handleUpdateHeader"
                  class="header-input-item" />
              </div>
            </template>

            <template v-if="formType !== tableType.CenturySkills">
              <div class="add-header-item">
                <a-tooltip title="Add new level">
                  <a-icon type="plus-circle" @click="handleAddNewHeader(hIndex)" />
                </a-tooltip>
              </div>
            </template>

            <!-- 表头删除图标-->
            <div class="remove-header" v-if="header.type.startsWith(headerType.UserDefine)">
              <a-popconfirm
                :title="'Remove Header ?'"
                class="rubric-delete-popconfirm"
                ok-text="Yes"
                @confirm="handleRemoveHeader(header)"
                cancel-text="No">
                <template slot="icon">
                  <div class="rubric-big-delete">
                    <img class="big-delete-icon" src="~@/assets/icons/evaluation/big_delete.png" />
                  </div>
                </template>
                <img src="~@/assets/icons/evaluation/delete.png" class="link-icon" />
              </a-popconfirm>
            </div>

          </th>
        </draggable>

        <!--预览和评估模式下不允许修改变动-->
        <tr class="table-header" v-if="mode !== this.tableMode.Edit">
          <th
            v-for="(header) in headers"
            :class="{'header-item': true, 'preview-mode': formTableMode === tableMode.Preview}"
            :key="header.type"
            v-if="!(header.type === headerType.Evidence && !(mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate))"
            :data-header-type="header.type"
            :data-header-mode="formTableMode">
            <!-- 表头文本-->
            <div class="label-text">

              <span class="header-label">{{ header.label }}</span>
              <template v-if="header.type === headerType.Novice">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students are introduced to the skills, and can watch others performing it(observation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if="header.type === headerType.Learner">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students copy others who use the skill and use the skill with scaffolding and guidance(emulation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if="header.type === headerType.Practitoner">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students employ the skill confidently and effectively(demonstration)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if="header.type === headerType.Expert">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students can show others how to use the skill and accurately assess how effectively the skill is
                    used(self-regulation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>
            </div>
          </th>
        </tr>
      </thead>

      <tbody class="table-body">
        <tr v-for="(item, lIndex) in list" class="body-line" :key="lIndex" :data-row-id="item.rowId">
          <td
            v-for="(header, hIndex) in headers"
            :class="{'body-item': true, 'big-body-item': formType === tableType.CenturySkills && header.type === headerType.Description}"
            :key="lIndex + '-' + header.type"
            @click="handleClickBodyItem(item, header)"
            v-if="!(header.type === headerType.Evidence && !(mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate))"
            :data-row-id="item.rowId"
            :data-header-type="header.type">
            <template v-if="item.hasOwnProperty(header.type)">

              <!-- 21 Century Criteria-->
              <template v-if="header.type === headerType.Criteria">
                <template v-if="formType === tableType.CenturySkills">
                  <template v-if="!item[headerType.Criteria] || !item[headerType.Criteria].name">
                    <div
                      class="data-item add-criteria"
                      @click.stop="handleAddCriteria(header, item, $event)"
                      v-show="mode === tableMode.Edit">
                      <add-opacity-icon />
                      <div class="add-text">Click to choose the objectives</div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="data-item criteria-data" @dblclick.stop="handleAddCriteria(header, item, $event)">
                      <div class="criteria-name">
                        {{ item[headerType.Criteria].name }}
                      </div>
                    </div>
                  </template>
                </template>
                <template v-if="formType === tableType.Rubric">
                  <template v-if="!item[headerType.Criteria] || !item[headerType.Criteria].name">
                    <div
                      class="data-item add-criteria"
                      @click="handleAddCriteria(header, item, $event)"
                      v-show="mode === tableMode.Edit">
                      <add-opacity-icon />
                      <div class="add-text">Click to choose the objectives</div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="data-item criteria-data" @dblclick="handleAddCriteria(header, item, $event)">
                      <div class="criteria-name">
                        {{ item[headerType.Criteria].name }}
                      </div>
                    </div>
                  </template>
                </template>
                <template v-if="formType === tableType.Rubric_2">
                  <div class="data-item criteria-data">
                    <div class="criteria-name">
                      {{ item[headerType.Criteria].name }}
                    </div>
                  </div>
                </template>
              </template>

              <!-- Description rubric_2的description支持选择-->
              <template v-if="header.type === headerType.Description">
                <template v-if="formType === tableType.Rubric_2">
                  <template v-if="!item[headerType.Description] || !item[headerType.Description].name">
                    <div
                      class="data-item add-criteria"
                      @click="handleAddCriteria(header, item, $event)"
                      v-show="mode === tableMode.Edit">
                      <add-opacity-icon />
                      <div class="add-text">Click to choose the objectives</div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="data-item criteria-data" @dblclick="handleAddCriteria(header, item, $event)">
                      <div class="criteria-name">
                        {{ item[headerType.Description].name }}
                      </div>
                    </div>
                  </template>
                </template>
                <template v-if="formType === tableType.CenturySkills">
                  <template v-if="!item[headerType.Description] || !item[headerType.Description].name">
                    <div
                      class="data-item add-criteria"
                      @click="handleAddCriteria(header, item, $event)"
                      v-show="mode === tableMode.Edit">
                      <add-opacity-icon />
                      <div class="add-text">Click to choose the objectives</div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="data-item criteria-data">
                      <div class="criteria-name my-century-criteria" @dblclick="handleAddCriteria(header, item, $event)">
                        <div class="criteria-left-name-list">
                          <div
                            :class="{'criteria-left-name-item': true, 'first-left-name': nIndex === 0, 'no-first-name': nIndex > 0}"
                            v-for="(name, nIndex) in item[headerType.Description].parentNameList"
                            :key="nIndex">
                            {{ name }}
                          </div>
                        </div>
                        <div class="criteria-right-description">
                          <div class="description-name">
                            {{ item[headerType.Description].userInputText ? item[headerType.Description].userInputText : item[headerType.Description].name
                            }}
                          </div>
                          <span class="edit-description" @click.stop="handleClickEnterCriteriaDescription(header, item)">
                            Please enter explanation for students to understand
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                </template>
              </template>
            </template>

            <template v-if="mode === tableMode.Edit">
              <!-- Indicators-->
              <template v-if="header.type === headerType.Indicators">
                <div class="my-indicator-input">
                  <a-textarea
                    style="height: 100%"
                    placeholder="Enter task specific indicators"
                    class="my-text-input"
                    v-model="item[headerType.Indicators].name"
                    @blur="handleUpdateField(header, item)" />
                </div>
              </template>
              <template v-if="header.type === headerType.Novice">
                <div class="indicator-input">
                  <a-textarea
                    style="height: 100%"
                    placeholder="Enter"
                    class="my-text-input"
                    v-model="item[headerType.Novice].name"
                    @blur="handleUpdateField(header, item)" />
                </div>
              </template>
              <template v-if="header.type === headerType.Learner">
                <div class="indicator-input">
                  <a-textarea
                    style="height: 100%"
                    placeholder="Enter"
                    class="my-text-input"
                    v-model="item[headerType.Learner].name"
                    @blur="handleUpdateField(header, item)" />
                </div>
              </template>
              <template v-if="header.type === headerType.Practitoner">
                <div class="indicator-input">
                  <a-textarea
                    style="height: 100%"
                    placeholder="Enter"
                    class="my-text-input"
                    v-model="item[headerType.Practitoner].name"
                    @blur="handleUpdateField(header, item)" />
                </div>
              </template>
              <template v-if="header.type === headerType.Expert">
                <div class="indicator-input">
                  <a-textarea
                    style="height: 100%"
                    placeholder="Enter"
                    class="my-text-input"
                    v-model="item[headerType.Expert].name"
                    @blur="handleUpdateField(header, item)" />
                </div>
              </template>

              <!-- UserDefine-->
              <template v-if="header.type.startsWith(headerType.UserDefine)">
                <div class="user-define-indicator-input">
                  <a-textarea
                    style="height: 100%"
                    placeholder="Enter"
                    class="my-text-input"
                    v-model="item[header.type].name"
                    @blur="handleUpdateField(header, item)" />
                </div>
              </template>
            </template>

            <!-- AchievementLevel-->
            <template v-if="header.type === headerType.AchievementLevel">
              <div
                class="sub-level-data"
                :data="JSON.stringify(formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId])">
                <div class="sub-level-list">
                  <div
                    class="sub-level-item"
                    v-for="(subLevel, sIndex) in item[headerType.AchievementLevel].subLevelDescription"
                    :key="sIndex">
                    <template v-if="mode === tableMode.Edit">
                      <div class="start-index" @click.stop="handleSwitchModeTips">
                        <div class="select-block">
                          <a-icon
                            class="select-block-icon"
                            type="border" />
                        </div>
                        {{ subLevel.startIndex }}
                      </div>
                      <div class="end-index" @click.stop="handleSwitchModeTips" v-show="subLevel.endIndex !== null">
                        <div class="select-block">
                          <a-icon
                            class="select-block-icon"
                            type="border" />
                        </div>
                        {{ subLevel.endIndex }}
                      </div>
                    </template>
                    <template v-if="mode !== tableMode.Edit">
                      <div class="start-index">
                        <div
                          class="select-block"
                          @click.stop="handleClickSubLevelItem(item, header, subLevel.startIndex)">
                          <img
                            src="~@/assets/icons/lesson/selected.png"
                            v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].data === subLevel.startIndex" />
                          <a-icon
                            class="select-block-icon"
                            type="border"
                            v-else />
                        </div>
                        {{ subLevel.startIndex }}
                      </div>
                      <div
                        class="end-index"
                        @click.stop="handleClickSubLevelItem(item, header, subLevel.endIndex)"
                        v-show="subLevel.endIndex !== null">
                        <div class="select-block">
                          <img
                            src="~@/assets/icons/lesson/selected.png"
                            v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].data === subLevel.endIndex" />
                          <a-icon
                            class="select-block-icon"
                            type="border"
                            v-else />
                        </div>
                        {{ subLevel.endIndex }}
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <div
                class="selected-icon"
                v-if="header.type !== headerType.AchievementLevel &&
                  header.type !== headerType.LevelDescriptor &&
                  header.type !== headerType.Indicators">
                <teacher-icon
                  v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)" />
                <student-icon
                  v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)" />
                <peer-icon
                  v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.PeerEvaluate)" />
              </div>
            </template>
            <!-- LevelDescriptor-->
            <template v-if="header.type === headerType.LevelDescriptor">
              <div class="sub-level-data" @click.stop="">
                <div class="sub-level-desc">
                  <div
                    class="sub-level-desc-item"
                    v-for="(subLevel, sIndex) in item[headerType.AchievementLevel].subLevelDescription"
                    :key="sIndex">
                    <a-tooltip placement="topLeft">
                      <template slot="title">
                        {{ subLevel.description }}
                      </template>
                      {{ subLevel.description }}
                    </a-tooltip>
                  </div>
                </div>
              </div>
              <div class="selected-icon">
                <teacher-icon
                  v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)" />
                <student-icon
                  v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)" />
                <peer-icon
                  v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.PeerEvaluate)" />
              </div>
            </template>

            <!-- 老师可以看到所有的评估数据，学生自评可以看到自己的和教师的，他评只能看到自己的-->
            <template
              v-if="mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate || mode === tableMode.PeerEvaluate">
              <!-- Indicators-->
              <template v-if="header.type === headerType.Indicators">
                <div class="indicator-data">
                  {{ item[headerType.Indicators].name }}
                </div>
              <!--                <div class="selected-icon" >-->
              <!--                  <teacher-icon v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)"/>-->
              <!--                  <student-icon v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)"/>-->
              <!--                  <peer-icon v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.PeerEvaluate)"/>-->
              <!--                </div>-->
              </template>
              <template v-if="header.type === headerType.Novice">
                <div class="indicator-data">
                  {{ item[headerType.Novice].name }}
                </div>
                <div class="selected-icon">
                  <teacher-icon
                    v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)" />
                  <student-icon
                    v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)" />
                  <peer-icon
                    v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.PeerEvaluate)" />
                </div>
              </template>
              <template v-if="header.type === headerType.Learner">
                <div class="indicator-data">
                  {{ item[headerType.Learner].name }}
                </div>
                <div class="selected-icon">
                  <teacher-icon
                    v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)" />
                  <student-icon
                    v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)" />
                  <peer-icon
                    v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.PeerEvaluate)" />
                </div>
              </template>
              <template v-if="header.type === headerType.Practitoner">
                <div class="indicator-data">
                  {{ item[headerType.Practitoner].name }}
                </div>
                <div class="selected-icon">
                  <teacher-icon
                    v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)" />
                  <student-icon
                    v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)" />
                  <peer-icon
                    v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.PeerEvaluate)" />
                </div>
              </template>
              <template v-if="header.type === headerType.Expert">
                <div class="indicator-data">
                  {{ item[headerType.Expert].name }}
                </div>
                <div class="selected-icon">
                  <teacher-icon
                    v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)" />
                  <student-icon
                    v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)" />
                  <peer-icon
                    v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.PeerEvaluate)" />
                </div>
              </template>

              <!-- UserDefine-->
              <template v-if="header.type.startsWith(headerType.UserDefine)">
                <div class="indicator-data">
                  {{ item[header.type].name }}
                </div>
                <div class="selected-icon">
                  <teacher-icon
                    v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)" />
                  <student-icon
                    v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.StudentEvaluate)" />
                  <peer-icon
                    v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (currentEvaluateMode === tableMode.TeacherEvaluate || currentEvaluateMode === tableMode.PeerEvaluate)" />
                </div>
              </template>
            </template>

            <!-- Evidence 仅在评估模式下显示-->
            <template
              v-if="header.type === headerType.Evidence && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate || mode === tableMode.PeerEvaluate)">
              <div class="evidence-data">
                <template v-if="formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].evidenceIdList">
                  <div
                    :class="{'evidence-info': true, 'exist-evidence': item[headerType.Evidence].num}"
                    @click="handleAddEvidenceLine(lIndex, item, $event)"
                    v-show="mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate">
                    <add-icon v-show="!formBodyData[item.rowId].evidenceIdList.length" />
                    <add-small-green-icon v-show="formBodyData[item.rowId].evidenceIdList.length" />
                    <div class="evidence-num">(
                      {{ formBodyData[item.rowId].evidenceIdList.length ? formBodyData[item.rowId].evidenceIdList.length : 0
                      }} )
                    </div>
                  </div>
                </template>
              </div>
            </template>

            <template v-if="hIndex === headers.length - 2 && mode === tableMode.Edit">
              <div class="add-more-header">
                <a-popconfirm
                  :title="'Delete this line ?'"
                  class="rubric-delete-popconfirm"
                  ok-text="Yes"
                  @confirm="handleDeleteLine(item)"
                  cancel-text="No">
                  <template slot="icon">
                    <div class="rubric-big-delete">
                      <img class="big-delete-icon" src="~@/assets/icons/evaluation/big_delete.png" />
                    </div>
                  </template>
                  <img src="~@/assets/icons/evaluation/delete.png" class="delete-row" />
                </a-popconfirm>
              </div>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="add-new-line" @click="handleAddNewLine" v-if="mode === tableMode.Edit">
      <div class="add-new-line-item">
        <add-green-icon />
      </div>
    </div>

    <a-modal
      v-model="selectCurriculumVisible"
      @ok="handleEnsureSelectCriteria"
      destroyOnClose
      width="1200px"
      :dialog-style="{ top: '20px' }">
      <div class="associate-library">
        <new-browser
          :select-mode="selectModel.evaluationMode"
          :show-menu="showMenuList"
          :default-active-menu="defaultActiveMenu"
          @select-all-21-century="handleSelectAll21CenturyListData"
          @select-curriculum="handleSelectCurriculumListData"
          @select-subject-specific-skill="handleSelectSubjectSpecificSkillListData"
          @select-century-skill="handleSelect21CenturySkillListData"
          @select-assessmentType="handleSelectAssessmentType"
          @select-idu="handleSelectIdu"
          @ensure-select='handleEnsureSelectCriteria'
          question-index="evaluation_" />
      </div>
    </a-modal>

    <a-modal
      v-model="inputDescriptionVisible"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      width="700px"
      destroyOnClose>
      <modal-header @close="inputDescriptionVisible = false" />
      <div class="rubric-modal">
        <div class="rubric-header">
          <div class="my-modal-header">
            The specific description you entered will be shown to students instead of the curriculum description
          </div>
        </div>
        <div class="description-text">
          <div class="old-description" v-if="currentEnterDescriptionLine">
            {{ currentEnterDescriptionLine[headerType.Description].name }}
          </div>
        </div>
        <div class="description-input">
          <a-textarea
            placeholder="Enter task specific description"
            :autosize="{ minRows: 3, maxRows: 6 }"
            v-model="inputDescription"
            @blur="handleUpdateDescription" />
        </div>
        <div class="select-rubric-action">
          <a-button
            shape="round"
            class="my-rubric-btn"
            style="width: 80px;background-color: #F5F5F5; border-color:#F5F5F5;box-shadow: none; color: #000000 "
            type="primary"
            @click="handleCancelDescription">Cancel
          </a-button>
          <a-button
            shape="round"
            class="my-rubric-btn"
            style="width: 80px;"
            type="primary"
            @click="handleEnsureDescription">Confirm
          </a-button>
        </div>
      </div>
    </a-modal>

  </div>
</template>

<script>

import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
import { SelectModel } from '@/components/NewLibrary/SelectModel'
import draggable from 'vuedraggable'
import NewBrowser from '@/components/NewLibrary/NewBrowser'
import { NavigationType } from '@/components/NewLibrary/NavigationType'
import EvaluationTableType from '@/components/Evaluation/EvaluationTableType'
import EvaluationTableMode from '@/components/Evaluation/EvaluationTableMode'
import EvaluationTableHeader from '@/components/Evaluation/EvaluationTableHeader'
import AddIcon from '@/assets/svgIcon/evaluation/form/tianjia.svg?inline'
import AddSmallGreenIcon from '@/assets/svgIcon/evaluation/form/tianjia_small_green.svg?inline'
import AddGreenIcon from '@/assets/svgIcon/evaluation/form/tianjia_green.svg?inline'
import AddOpacityIcon from '@/assets/svgIcon/evaluation/form/tianjia_opacity.svg?inline'
import QuestionIcon from '@/assets/svgIcon/evaluation/form/question.svg?inline'
import ModalHeader from '@/components/Common/ModalHeader'
import PeerIcon from '@/assets/svgIcon/evaluation/PeerIcon.svg?inline'
import StudentIcon from '@/assets/svgIcon/evaluation/StudentIcon.svg?inline'
import TeacherIcon from '@/assets/svgIcon/evaluation/TeacherIcon.svg?inline'

export default {
  name: 'EvaluationTable',
  components: {
    AddIcon,
    AddSmallGreenIcon,
    AddOpacityIcon,
    AddGreenIcon,
    QuestionIcon,
    ModalHeader,
    draggable,
    NewBrowser,
    StudentIcon,
    PeerIcon,
    TeacherIcon
  },
  props: {
    initRawData: {
      type: Array,
      default: () => []
    },
    initRawHeaders: {
      type: Array,
      default: () => []
    },
    formId: {
      type: String,
      required: true
    },
    formTableMode: {
      type: String,
      default: EvaluationTableMode.Edit
    },
    formType: {
      type: Number,
      required: true
    },
    formBodyData: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      selectModel: SelectModel,
      selfHeaderAddIndex: 1,
      headers: [], // 表头
      list: [], // 表结构数据
      defaultActiveMenu: NavigationType.specificSkills,
      showMenuList: [NavigationType.centurySkills],
      mode: null,

      selectCurriculumVisible: false,
      selectKnowledgeTagVisible: false,
      selectedKnowledgeTag: [],
      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],

      currentSelectHeader: null,
      currentSelectLine: null,

      tableType: EvaluationTableType,
      tableMode: EvaluationTableMode,
      headerType: EvaluationTableHeader,

      selectedAll21CenturyList: [],
      selectedCurriculumList: [],

      selected21CenturySkillList: [],
      selectedSubjectSpecificSkillList: [],
      selectedAssessmentList: [],
      selectedIduList: [],

      inputDescriptionVisible: false,
      inputDescription: null,
      currentEnterDescriptionLine: null,
      currentEvaluateMode: EvaluationTableMode.TeacherEvaluate, // 评价模式,

      disabledDraggable: false,

      evaluateStudentId: null, // 当前正在评估的学生id
      evaluateStudentName: null // 当前正在评估的学生姓名
    }
  },
  created () {
    this.$logger.info('[' + this.formTableMode + '] EvaluationTable created formType ' + this.formType, 'initRawHeaders', this.initRawHeaders, 'initRawData', this.initRawData, ' formBodyData', this.formBodyData)
    this.mode = this.formTableMode

    const params = new URLSearchParams(document.location.search)
    this.evaluateStudentId = params.get('student-id')
    this.evaluateStudentName = params.get('student-name')
    this.$logger.info('evaluateStudentId ' + this.evaluateStudentId + ' evaluateStudentName ' + this.evaluateStudentName)

    if (this.formTableMode === EvaluationTableMode.TeacherEvaluate && this.$store.getters.userInfo.roles.indexOf('teacher') !== -1) {
      this.currentEvaluateMode = EvaluationTableMode.TeacherEvaluate
    } else {
      if (this.formTableMode === EvaluationTableMode.StudentEvaluate) {
        this.currentEvaluateMode = EvaluationTableMode.StudentEvaluate
      } else if (this.formTableMode === EvaluationTableMode.PeerEvaluate) {
        this.currentEvaluateMode = EvaluationTableMode.PeerEvaluate
      } else {
        this.$logger.info('current formTableMode illegal ' + this.formTableMode)
      }
      this.$logger.info('current currentEvaluateMode ' + this.currentEvaluateMode)
    }
    if (this.initRawHeaders.length) {
      this.headers = this.initRawHeaders
    } else {
      if (this.formType === EvaluationTableType.Rubric) {
        this.headers = [
          {
            label: 'Criteria',
            previewLabel: 'Criteria',
            type: EvaluationTableHeader.Criteria,
            editable: false,
            editing: false,
            required: true
          },
          {
            label: 'Achievement Level',
            previewLabel: 'Achievement Level',
            type: EvaluationTableHeader.AchievementLevel,
            editable: false,
            editing: false,
            required: true
          },
          {
            label: 'Level descriptor',
            previewLabel: 'Level descriptor',
            type: EvaluationTableHeader.LevelDescriptor,
            editable: false,
            editing: false,
            required: true
          },
          {
            label: 'Task specific indicators',
            previewLabel: 'Task specific indicators',
            type: EvaluationTableHeader.Indicators,
            editable: false,
            editing: false,
            required: true
          },
          {
            label: 'Evidence',
            previewLabel: 'Evidence',
            type: EvaluationTableHeader.Evidence,
            editable: false,
            editing: false,
            required: true
          }
        ]
      } else if (this.formType === EvaluationTableType.Rubric_2) {
        this.headers = [
          {
            label: 'Description',
            previewLabel: 'Description',
            type: EvaluationTableHeader.Description,
            editable: false,
            editing: false,
            required: true
          },
          {
            label: 'Unnamed level',
            previewLabel: 'Unnamed level',
            type: EvaluationTableHeader.UserDefine,
            editable: true,
            editing: false,
            required: false
          },
          {
            label: 'Evidence',
            previewLabel: 'Evidence',
            type: EvaluationTableHeader.Evidence,
            editable: false,
            editing: false,
            required: true
          }
        ]
      } else if (this.formType === EvaluationTableType.CenturySkills) {
        /**
         *  第三种表需要针对NZ和AU用户在最左侧添加一列命名为Criteria
         Cambridge/IB/IGCSE的用户只看到第二列，点击后看到21st century skills数据入口
         */
        const bindCurriculum = parseInt(this.$store.getters.bindCurriculum)
        if (bindCurriculum === 1 || bindCurriculum === 2) {
          this.headers = [
            {
              label: 'Criteria',
              previewLabel: 'Criteria',
              type: EvaluationTableHeader.Criteria,
              editable: false,
              editing: false,
              required: true
            },
            {
              label: '21st century skills',
              previewLabel: '21st century skills',
              type: EvaluationTableHeader.Description,
              editable: false,
              editing: false,
              required: true
            },
            {
              label: 'Novice',
              previewLabel: 'Novice',
              type: EvaluationTableHeader.Novice,
              editable: false,
              editing: false,
              required: true
            },
            {
              label: 'Learner',
              previewLabel: 'Learner',
              type: EvaluationTableHeader.Learner,
              editable: false,
              editing: false,
              required: true
            },
            {
              label: 'Practitoner',
              previewLabel: 'Practitoner',
              type: EvaluationTableHeader.Practitoner,
              editable: false,
              editing: false,
              required: true
            },
            {
              label: 'Expert',
              previewLabel: 'Expert',
              type: EvaluationTableHeader.Expert,
              editable: false,
              editing: false,
              required: true
            },
            {
              label: 'Evidence',
              previewLabel: 'Evidence',
              type: EvaluationTableHeader.Evidence,
              editable: false,
              editing: false,
              required: true
            }
          ]
        } else {
          this.headers = [
            {
              label: '21st century skills',
              previewLabel: '21st century skills',
              type: EvaluationTableHeader.Description,
              editable: false,
              editing: false,
              required: true
            },
            {
              label: 'Novice',
              previewLabel: 'Novice',
              type: EvaluationTableHeader.Novice,
              editable: false,
              editing: false,
              required: true
            },
            {
              label: 'Learner',
              previewLabel: 'Learner',
              type: EvaluationTableHeader.Learner,
              editable: false,
              editing: false,
              required: true
            },
            {
              label: 'Practitoner',
              previewLabel: 'Practitoner',
              type: EvaluationTableHeader.Practitoner,
              editable: false,
              editing: false,
              required: true
            },
            {
              label: 'Expert',
              previewLabel: 'Expert',
              type: EvaluationTableHeader.Expert,
              editable: false,
              editing: false,
              required: true
            },
            {
              label: 'Evidence',
              previewLabel: 'Evidence',
              type: EvaluationTableHeader.Evidence,
              editable: false,
              editing: false,
              required: true
            }
          ]
        }
      }
    }
    this.$logger.info('[' + this.mode + '] form headers ', this.headers)

    if (this.initRawData.length) {
      this.list = this.initRawData
    } else {
      this.handleAddNewLine()
    }
    LibraryEventBus.$on(LibraryEvent.ContentListSelectClick, this.handleContentListSelectClick)
  },
  destroyed () {
    LibraryEventBus.$off(LibraryEvent.ContentListSelectClick, this.handleContentListSelectClick)
    this.$logger.info('[' + this.mode + '] off NewClickableKnowledgeTag ContentListSelectClick handler')
  },
  methods: {

    handleContentListSelectClick (data) {
      if (data.questionIndex === 'evaluation_') {
        this.$logger.info('[' + this.mode + '] evaluation handleContentListSelectClick hit', data)
        LibraryEventBus.$emit(LibraryEvent.ContentListSelectedListUpdate, { id: data.subKnowledgeId })
      }
    },

    handleEditHeader (header) {
      this.disabledDraggable = true
      this.$logger.info('disabled Draggable')
      this.$logger.info('[' + this.mode + '] handleEditHeader', header)
      if (header.editable) {
        this.headers.forEach(item => {
          if (item.label.length === 0) {
            item.label = item.previewLabel
          }
        })

        // 选中表头改为编辑状态
        this.headers.forEach(item => {
          if (item === header) {
            item.editing = true
            item.previewLabel = item.label
          } else {
            item.editing = false
          }
        })
      } else {
        this.$logger.info('[' + this.mode + '] current header not editable', header)
      }
    },

    handleUpdateHeader () {
      // 如果没输入表头，重置为默认表头
      this.headers.forEach(item => {
        if (item.label.length === 0) {
          item.label = item.previewLabel
        }
      })

      // 取消编辑状态
      this.headers.forEach(item => {
        item.editing = false
      })
      this.disabledDraggable = false
    },

    handleAddNewHeader (hIndex) {
      this.$logger.info('[' + this.mode + '] handleAddNewHeader this.selfHeaderTypeIndex ' + this.selfHeaderAddIndex + ' hIndex ' + hIndex)

      // 重新生成一个唯一的表头类型，示例：user_define__1、user_define__2
      let userDefineHeaderType = this.headerType.UserDefine + this.selfHeaderAddIndex
      const allHeaderType = []
      this.headers.forEach(item => allHeaderType.push(item.type))
      while (allHeaderType.indexOf(userDefineHeaderType) !== -1) {
        this.selfHeaderAddIndex++
        userDefineHeaderType = this.headerType.UserDefine + this.selfHeaderAddIndex
      }

      // 新增表头
      const headerItem = {
        label: 'Unnamed Level ' + this.selfHeaderAddIndex,
        previewLabel: 'Unnamed Level ' + this.selfHeaderAddIndex,
        type: userDefineHeaderType,
        editable: true,
        editing: false
      }

      // 默认倒数第二列新增，最后一列为evidence
      this.headers.splice(hIndex + 1, 0, headerItem)

      // 初始化对应列的数据
      const oldList = JSON.parse(JSON.stringify(this.list))
      console.log(oldList)
      oldList.forEach(item => {
        item[headerItem.type] = { name: null }
      })
      this.list = oldList
      this.$logger.info('[' + this.mode + '] after update list', this.list)
      this.selfHeaderAddIndex++
    },

    handleRemoveHeader (header) {
      this.$logger.info('[' + this.mode + '] handleRemoveHeader ', header)
      const index = this.headers.findIndex(item => item.type === header.type)
      if (index !== -1) {
        this.headers.splice(index, 1)
      }
      const oldList = JSON.parse(JSON.stringify(this.list))
      oldList.forEach(item => {
        delete item[header.type]
      })
      this.list = oldList
      this.$logger.info('[' + this.mode + '] after delete column update list', this.list)
    },

    handleAddNewLine () {
      this.$logger.info('[' + this.mode + '] handleAddNewLine ')
      const newLineItem = {}
      const rowId = this.generateRowId()
      newLineItem.rowId = rowId
      this.headers.forEach(header => {
        newLineItem[header.type] = {
          name: null,
          rowId
        }
      })

      if (this.formType === this.tableType.CenturySkills) {
        newLineItem[this.headerType.Description] = {
          name: null,
          rowId,
          parentNameList: []
        }

        newLineItem[this.headerType.Evidence] = {
          num: 0,
          selectedList: [],
          selectedStudentList: [],
          rowId
        }
      } else if (this.formType === this.tableType.Rubric) {
        newLineItem[this.headerType.AchievementLevel] = {
          rowId,
          subLevelDescription: []
        }

        newLineItem[this.headerType.Evidence] = {
          num: 0,
          selectedList: [],
          selectedStudentList: [],
          rowId
        }
      } else if (this.formType === this.tableType.Rubric_2) {
        newLineItem[this.headerType.Evidence] = {
          num: 0,
          selectedList: [],
          selectedStudentList: [],
          rowId
        }
      }
      this.$logger.info('[' + this.mode + '] init new line ', newLineItem)
      this.list.push(newLineItem)
    },

    handleDragEnd () {
      this.$logger.info('[' + this.mode + '] handleDragEnd', this.headers)
    },

    handleDeleteLine (deleteLine) {
      this.$logger.info('[' + this.mode + '] handleDeleteLine', deleteLine)
      if (this.mode === EvaluationTableMode.Edit) {
        this.list = this.list.filter(item => item !== deleteLine)
      }
    },

    handleClickBodyItem (item, header) {
      this.$logger.info('[' + this.mode + '][' + this.currentEvaluateMode + '] handleClickBodyItem ' + header.label, item, 'header', header)
      if ([EvaluationTableHeader.Indicators,
        EvaluationTableHeader.Novice,
        EvaluationTableHeader.Learner,
        EvaluationTableHeader.Practitoner,
        EvaluationTableHeader.AchievementLevel,
        EvaluationTableHeader.LevelDescriptor,
        EvaluationTableHeader.Expert,
        EvaluationTableHeader.UserDefine].indexOf(header.type) !== -1 || header.type.startsWith(EvaluationTableHeader.UserDefine)) {
        this.$emit('update-evaluation', {
          formId: this.formId,
          evaluationMode: this.currentEvaluateMode,
          rowId: item.rowId,
          value: header.type, // 评价所选的列
          evaluateUserEmail: this.mode === EvaluationTableMode.TeacherEvaluate ? this.$store.getters.userInfo.email : this.evaluateStudentId,
          evaluateUserName: this.mode === EvaluationTableMode.TeacherEvaluate ? this.$store.getters.userInfo.nickname : this.evaluateStudentName,
          data: null
        })
      }
    },

    handleClickSubLevelItem (item, header, subLevel) {
      this.$logger.info(subLevel + ' [' + this.mode + '][' + this.currentEvaluateMode + '] handleClickSubLevelItem ' + header.label, item, 'header', header)
      if ([EvaluationTableHeader.Indicators,
        EvaluationTableHeader.Novice,
        EvaluationTableHeader.Learner,
        EvaluationTableHeader.Practitoner,
        EvaluationTableHeader.AchievementLevel,
        EvaluationTableHeader.LevelDescriptor,
        EvaluationTableHeader.Expert,
        EvaluationTableHeader.UserDefine].indexOf(header.type) !== -1 || header.type.startsWith(EvaluationTableHeader.UserDefine)) {
        this.$emit('update-evaluation', {
          formId: this.formId,
          evaluationMode: this.currentEvaluateMode,
          rowId: item.rowId,
          value: header.type, // 评价所选的列
          evaluateUserEmail: this.mode === EvaluationTableMode.TeacherEvaluate ? this.$store.getters.userInfo.email : this.evaluateStudentId,
          evaluateUserName: this.mode === EvaluationTableMode.TeacherEvaluate ? this.$store.getters.userInfo.nickname : this.evaluateStudentName,
          data: subLevel
        })
      }
    },

    handleSwitchModeTips () {
      this.$message.warn('Please switch to evaluation mode first!')
    },

    handleAddCriteria (header, item, event) {
      event.preventDefault()
      event.stopPropagation()
      this.$logger.info('[' + this.mode + '] handleAddCriteria ' + header.type, header, item)
      if (this.mode === EvaluationTableMode.Edit) {
        if (this.formType === this.tableType.Rubric_2) {
          /**
           * 第一种评估表能看到
           Learning outcomes
           Achievement objectives
           Assessment types
           */
          this.showMenuList = [NavigationType.learningOutcomes, NavigationType.specificSkills, NavigationType.assessmentType]
          this.defaultActiveMenu = NavigationType.learningOutcomes
        } else if (this.formType === this.tableType.Rubric) {
          /**
           * 第二种能看到IB大纲下的
           * Achievement objectives，及IDU
           */
          this.showMenuList = [NavigationType.specificSkills, NavigationType.idu]
          this.defaultActiveMenu = NavigationType.specificSkills
        } else if (this.formType === this.tableType.CenturySkills) {
          /**
           *  第三种表需要针对NZ和AU用户在最左侧添加一列命名为Criteria
           Cambridge/IB/IGCSE的用户只看到第二列，点击后看到21st century skills数据入口
           NZ和AU的用户在第一列criteria列点击后看到
           NZ-Key competencies
           AU-General capabilities的入口，然后在第二列点击后看到21st century skills数据入口
           */
          this.$logger.info('CenturySkills header.type ' + header.type, header.type === this.headerType.Description, header.type === this.headerType.Criteria)
          if (header.type === this.headerType.Description) {
            this.showMenuList = [NavigationType.centurySkills]
            this.defaultActiveMenu = NavigationType.centurySkills
          } else if (header.type === this.headerType.Criteria) {
            const bindCurriculum = parseInt(this.$store.getters.bindCurriculum)
            if (bindCurriculum === 1) {
              this.showMenuList = [NavigationType.AUGeneralCapabilities]
              this.defaultActiveMenu = NavigationType.AUGeneralCapabilities
            } else if (bindCurriculum === 2) {
              this.showMenuList = [NavigationType.NZKeyCompetencies]
              this.defaultActiveMenu = NavigationType.NZKeyCompetencies
            }
          }
        }
        this.selectCurriculumVisible = true
        this.currentSelectHeader = header
        this.currentSelectLine = item
      }
    },

    handleEnsureSelectCriteria () {
      this.$logger.info('[' + this.mode + '] handleEnsureSelectCriteria', 'this.list', this.list)
      this.selectCurriculumVisible = false

      const selectedList = []
      // 汇总数据
      this.selectedAll21CenturyList.forEach(item => {
        selectedList.push(item)
      })
      this.selectedCurriculumList.forEach(item => {
        selectedList.push(item)
      })
      this.selected21CenturySkillList.forEach(item => {
        selectedList.push(item)
      })
      this.selectedSubjectSpecificSkillList.forEach(item => {
        selectedList.push(item)
      })
      this.selectedAssessmentList.forEach(item => {
        selectedList.push(item)
      })
      this.selectedIduList.forEach(item => {
        selectedList.push(item)
      })

      this.$logger.info('formType ' + this.formType + ' selectedList', selectedList)
      if (this.formType === this.tableType.CenturySkills) {
        if (selectedList.length >= 1) {
          /**
           *  第三种表需要针对NZ和AU用户在最左侧添加一列命名为Criteria
           Cambridge/IB/IGCSE的用户只看到第二列，点击后看到21st century skills数据入口
           NZ和AU的用户在第一列criteria列点击后看到
           NZ-Key competencies
           AU-General capabilities的入口，然后在第二列点击后看到21st century skills数据入口
           */
          const header = Object.assign(this.currentSelectHeader)
          if (header.type === this.headerType.Description) {
            this.currentSelectLine[this.headerType.Description] = {
              name: selectedList[0].name,
              rowId: this.currentSelectLine.rowId,
              parentNameList: selectedList[0].parentNameList
            }
            this.$logger.info('[' + this.mode + '] update currentSelectLine with Description 1 data ', this.currentSelectLine)

            // 如果多选，从第二个元素开始新建行填充数据
            if (selectedList.length > 1) {
              selectedList.forEach((item, index) => {
                if (index > 0) {
                  const newLineItem = {}
                  const rowId = this.generateRowId()
                  newLineItem.rowId = rowId
                  this.headers.forEach(header => {
                    newLineItem[header.type] = {
                      name: null,
                      rowId
                    }
                  })
                  newLineItem[this.headerType.Description] = {
                    name: item.name,
                    rowId,
                    parentNameList: item.parentNameList
                  }

                  newLineItem[this.headerType.Evidence] = {
                    num: 0,
                    selectedList: [],
                    selectedStudentList: [],
                    rowId
                  }
                  newLineItem.rowId = rowId
                  this.$logger.info('[' + this.mode + '] CenturySkills add new line with Description data ', newLineItem)
                  this.list.push(newLineItem)
                }
              })
            }
          } else if (header.type === this.headerType.Criteria) {
            this.currentSelectLine[this.headerType.Criteria] = {
              name: selectedList[0].name,
              rowId: this.currentSelectLine.rowId
            }

            this.$logger.info('[' + this.mode + '] update currentSelectLine with criteria 1 data ', this.currentSelectLine)

            // 如果多选，从第二个元素开始新建行填充数据
            if (selectedList.length > 1) {
              selectedList.forEach((item, index) => {
                if (index > 0) {
                  const newLineItem = {}
                  const rowId = this.generateRowId()
                  newLineItem.rowId = rowId
                  this.headers.forEach(header => {
                    newLineItem[header.type] = {
                      name: null,
                      rowId
                    }
                  })
                  newLineItem[this.headerType.Description] = {
                    name: null,
                    rowId,
                    parentNameList: []
                  }

                  newLineItem[this.headerType.Criteria] = {
                    name: item.name,
                    rowId: newLineItem.rowId
                  }

                  newLineItem[this.headerType.Evidence] = {
                    num: 0,
                    selectedList: [],
                    selectedStudentList: [],
                    rowId
                  }
                  newLineItem.rowId = rowId
                  this.$logger.info('[' + this.mode + '] CenturySkills add new line with criteria data ', newLineItem)
                  this.list.push(newLineItem)
                }
              })
            }
          }
        }

        this.list = this.list.filter(item => (!item.description || item.description.name))
        this.$logger.info('CenturySkills 过滤掉没有Description的行', this.list)
      } else if (this.formType === this.tableType.Rubric) {
        if (selectedList.length >= 1) {
          // 如果只选择了一个，使用第一个填充当前行数据
          this.currentSelectLine[this.headerType.Criteria] = {
            name: selectedList[0].name,
            rowId: this.currentSelectLine.rowId
          }

          this.currentSelectLine[this.headerType.AchievementLevel] = {
            name: selectedList[0].name,
            rowId: this.currentSelectLine.rowId,
            subLevelDescription: selectedList[0].subLevelDescription
          }

          this.$logger.info('[' + this.mode + '] update currentSelectLine with criteria data ', this.currentSelectLine)

          // 如果多选，从第二个元素开始新建行填充数据
          if (selectedList.length > 1) {
            selectedList.forEach((descriptionItem, index) => {
              if (index > 0) {
                const newLineItem = {}
                const rowId = this.generateRowId()
                this.headers.forEach(header => {
                  newLineItem[header.type] = {
                    name: null,
                    rowId
                  }
                })
                newLineItem[this.headerType.Criteria] = {
                  name: descriptionItem.name,
                  rowId
                }

                newLineItem[this.headerType.AchievementLevel] = {
                  name: descriptionItem.name,
                  rowId,
                  subLevelDescription: descriptionItem.subLevelDescription
                }

                newLineItem[this.headerType.Evidence] = {
                  num: 0,
                  selectedList: [],
                  selectedStudentList: [],
                  rowId
                }
                newLineItem.rowId = rowId

                this.$logger.info('[' + this.mode + '] Rubric add new line with criteria data ', newLineItem)
                this.list.push(newLineItem)
              }
            })
          }
        }
        this.list = this.list.filter(item => (!item.criteria || item.criteria.name))
        this.$logger.info('Rubric 过滤掉没有criteria的行', this.list)
      } else if (this.formType === this.tableType.Rubric_2) {
        this.$logger.info('[' + this.mode + '] tableType.Rubric selectedList', selectedList)
        if (selectedList.length >= 1) {
          // 如果只选择了一个，使用第一个填充当前行数据
          this.currentSelectLine[this.headerType.Description] = {
            name: selectedList[0].name,
            rowId: this.currentSelectLine.rowId
          }

          this.$logger.info('[' + this.mode + '] update currentSelectLine description with criteria data ', this.currentSelectLine)

          // 如果多选，从第二个元素开始新建行填充数据
          if (selectedList.length > 1) {
            selectedList.forEach((descriptionItem, index) => {
              if (index > 0) {
                const newLineItem = {}
                const rowId = this.generateRowId()
                this.headers.forEach(header => {
                  newLineItem[header.type] = {
                    name: null,
                    rowId
                  }
                })
                newLineItem[this.headerType.Description] = {
                  name: descriptionItem.name,
                  rowId
                }

                newLineItem[this.headerType.Evidence] = {
                  num: 0,
                  selectedList: [],
                  selectedStudentList: [],
                  rowId
                }
                newLineItem.rowId = rowId

                this.$logger.info('[' + this.mode + '] Rubric description add new line with criteria data ', newLineItem)
                this.list.push(newLineItem)
              }
            })
          }
        }
        this.list = this.list.filter(item => (!item.description || item.description.name))
        this.$logger.info('Rubric_2 过滤掉没有Description的行', this.list)
      } else {
        this.$logger.info('[' + this.mode + '] rubric form no allow select')
      }
      // 重置选择的列表数据
      this.selectedAll21CenturyList = []
      this.selectedCurriculumList = []
      this.selected21CenturySkillList = []
      this.selectedSubjectSpecificSkillList = []
      this.selectedAssessmentList = []
      this.selectedIduList = []
    },

    handleUpdateDescription (header, item) {
      this.$logger.info('[' + this.mode + '] handleUpdateDescription', header, item)
    },

    handleUpdateField (header, item) {
      this.$logger.info('[' + this.mode + '] handleUpdateField', header, item)
    },

    handleClickEnterCriteriaDescription (header, item) {
      this.$logger.info('[' + this.mode + '] handleClickEnterCriteriaDescription', header, item)
      if (this.mode === EvaluationTableMode.Edit) {
        this.inputDescription = item[this.headerType.Description].userInputText
        this.currentEnterDescriptionLine = item
        this.inputDescriptionVisible = true
      }
    },

    handleEnsureDescription () {
      this.$logger.info('[' + this.mode + '] handleEnsureDescription ' + this.inputDescription)
      this.currentEnterDescriptionLine[this.headerType.Description].userInputText = this.inputDescription
      if (this.mode === EvaluationTableMode.Edit) {
        this.inputDescriptionVisible = false
        this.currentEnterDescriptionLine = null
        this.inputDescription = null
      }
    },

    handleCancelDescription () {
      this.$logger.info('[' + this.mode + '] handleEnsureDescription ' + this.inputDescription)
      this.currentEnterDescriptionLine = null
      this.inputDescription = null
      this.inputDescriptionVisible = false
    },

    handleAddEvidenceLine (lIndex, item, event) {
      event.stopPropagation()
      event.preventDefault()
      this.$logger.info('[' + this.mode + '] handleAddEvidenceLine', lIndex, item)
      this.$emit('add-evidence', {
        index: lIndex, data: item
      })
    },
    handleSelectAll21CenturyListData (data) {
      this.$logger.info('[' + this.mode + '] EvaluationTable handleSelectAll21CenturyListData', data)
      const descriptionList = []
      data.forEach(dataItem => {
        const item = dataItem.item
        const descriptionItem = {
          name: item.name
        }
        descriptionList.push(descriptionItem)
      })
      this.selectedAll21CenturyList = descriptionList
      this.$logger.info('[' + this.mode + '] selectedAll21CenturyList ', descriptionList)
    },

    handleSelectCurriculumListData (data) {
      this.$logger.info('[' + this.mode + '] EvaluationTable handleSelectCurriculumListData', data)
      const descriptionList = []
      data.forEach(dataItem => {
        const descriptionItem = {
          name: dataItem.knowledgeData.name
        }
        descriptionList.push(descriptionItem)
      })
      this.selectedCurriculumList = descriptionList
      this.$logger.info('[' + this.mode + '] handleSelectCurriculumListData ', descriptionList)
    },

    handleSelectSubjectSpecificSkillListData (data) {
      this.$logger.info('[' + this.mode + '] EvaluationTable handleSelectSubjectSpecificSkillListData', data)
      const descriptionList = []
      data.forEach(dataItem => {
        // 处理提取年级和描述数据:
        const rawSubLevelList = dataItem.knowledgeData.subLevelDescripton
        const newSubLevelList = []
        rawSubLevelList.forEach(item => {
          const indexRange = item[0]
          const indexRangeArray = indexRange.split('-')
          const startIndex = parseInt(indexRangeArray[0])
          let endIndex = null
          if (indexRangeArray.length === 2) {
            endIndex = parseInt(indexRangeArray[1])
          }
          const description = item[1]
          newSubLevelList.push({
            startIndex: startIndex,
            endIndex: endIndex,
            description: description
          })
        })
        this.$logger.info('[' + this.mode + '] handle subLevel', rawSubLevelList, newSubLevelList)
        const descriptionItem = {
          name: dataItem.knowledgeData.name,
          subLevelDescription: newSubLevelList
        }

        descriptionList.push(descriptionItem)
      })
      this.selectedSubjectSpecificSkillList = descriptionList
      this.$logger.info('[' + this.mode + '] handleSelectSubjectSpecificSkillListData ', descriptionList)
    },

    handleSelect21CenturySkillListData (data) {
      this.$logger.info('[' + this.mode + '] EvaluationTable handleSelectCurriculumListData', data)
      const descriptionList = []
      data.forEach(dataItem => {
        const parentNameList = []
        let parent = dataItem.knowledgeData.originParent
        let count = 3
        while (parent && count-- > 0) {
          parentNameList.push(parent.name)
          parent = parent.originParent
        }
        const descriptionItem = {
          name: dataItem.knowledgeData.name,
          parentNameList: parentNameList
        }

        descriptionList.push(descriptionItem)
      })
      this.selectedCurriculumList = descriptionList
      this.$logger.info('[' + this.mode + '] handleSelectCurriculumListData ', descriptionList)

      // 取消层级的选择
      LibraryEventBus.$emit(LibraryEvent.CancelCenturySkillsSelect)
    },

    handleSelectAssessmentType (data) {
      this.$logger.info('[' + this.mode + '] EvaluationTable handleSelectAssessmentType', data)
      const descriptionList = []
      data.forEach(dataItem => {
        const descriptionItem = {
          name: dataItem.knowledgeData.name
        }

        descriptionList.push(descriptionItem)
      })
      this.selectedAssessmentList = descriptionList
      this.$logger.info('[' + this.mode + '] handleSelectAssessmentType ', descriptionList)
    },

    handleSelectIdu (data) {
      this.$logger.info('[' + this.mode + '] EvaluationTable handleSelectIdu', data)
      const descriptionList = []
      data.forEach(dataItem => {
        // 处理提取年级和描述数据:
        const rawSubLevelList = dataItem.knowledgeData.subLevelDescripton
        const newSubLevelList = []
        rawSubLevelList.forEach(item => {
          const indexRange = item[0]
          // 兼容中英文的'-'号
          let indexRangeArray = []
          if (indexRange.indexOf('–') !== -1) {
            indexRangeArray = indexRange.split('–')
          } else if (indexRangeArray.indexOf('-') !== -1) {
            indexRangeArray = indexRange.split('-')
          } else {
            indexRangeArray = [indexRange]
          }
          this.$logger.info('indexRangeArray', indexRangeArray, item)
          const startIndex = parseInt(indexRangeArray[0])
          let endIndex = null
          if (indexRangeArray.length === 2) {
            endIndex = parseInt(indexRangeArray[1])
          }
          const description = item[1]
          newSubLevelList.push({
            startIndex: startIndex,
            endIndex: endIndex,
            description: description
          })
        })
        this.$logger.info('[' + this.mode + '] handle subLevel', rawSubLevelList, newSubLevelList)
        const descriptionItem = {
          name: dataItem.knowledgeData.name,
          subLevelDescription: newSubLevelList
        }

        descriptionList.push(descriptionItem)
      })
      this.selectedIduList = descriptionList
      this.$logger.info('[' + this.mode + '] handleSelectIdu ', descriptionList)
    },
    handleCancelSelectData () {
    },

    getTableStructData () {
      this.$logger.info('getTableStructData', this.headers, this.list)
      return {
        headers: this.headers,
        list: this.list,
        formId: this.formId
      }
    },

    generateRowId () {
      let rowId = 'row_' + Math.random()
      while (this.list.findIndex(item => item.rowId === rowId) !== -1) {
        rowId = 'row_' + Math.random()
      }
      this.$logger.info('generateRowId ' + rowId)
      return rowId
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.rubric {
  .rubric-table {
    margin-bottom: 10px;
    table-layout: fixed;
    margin-right: 30px;

    .table-header {
      border-top: 1px solid #15C39A;
      border-left: 1px solid #15C39A;
      background: #15C39A;

      .header-item:hover {
        //background: #07AB84;
        .edit-icon {
          display: flex;
        }
      }

      .header-item {
        position: relative;
        box-sizing: border-box;
        border-right: 1px solid #999;
        border-bottom: 1px solid #999;
        padding: 0;
        overflow: hidden;

        .edit-icon {
          position: absolute;
          right: 10px;
          top: 10px;
          display: none;
          cursor: pointer;

          img {
            height: 15px;
          }
        }

        .label-text {
          padding: 5px 10px;
          font-weight: 300;
          color: #fff;
          display: flex;
          align-items: center;
          line-height: 25px;
          vertical-align: middle;
          cursor: pointer;
          z-index: 50;
          font-family: Inter-Bold;

          .header-label {
            padding: 0 5px;
            font-weight: 300;
            color: #fff;
            display: flex;
            align-items: center;
            line-height: 25px;
            vertical-align: middle;
            cursor: pointer;
          }
        }

        .label-input {
          z-index: 100;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          background-color: #fff;

          input {
            font-family: Inter-Bold;
            outline: none;
            vertical-align: middle;
            padding: 5px 10px;
            line-height: 25px;
            width: 100%;
            border: none;
            background-color: #fff;
          }
        }

        .remove-header {
          position: absolute;
          right: 0px;
          top: 50%;
          margin-top: -13px;
          color: red;
          display: none;

          img {
            height: 30px;
          }
        }

        .add-header-item {
          background-color: #15C39A;
          position: absolute;
          right: 30px;
          top: 50%;
          margin-top: -13px;
          color: #fff;
          font-size: 19px;
          display: none;

          img {
            height: 30px;
          }
        }
      }

      .preview-mode {
        min-width: 50px;
      }

      .header-item:last-child {
        overflow: visible;
      }

      .header-item:hover {
        .remove-header {
          display: block;
          cursor: pointer;
        }

        .add-header-item {
          display: block;
          cursor: pointer;
        }
      }

      .add-more-header {
        cursor: pointer;
        position: absolute;
        right: -30px;
        font-size: 20px;
        color: @primary-color;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 5px;
      }
    }

    .table-body {
      border-left: 1px solid rgba(216, 216, 216, 1);

      .body-line {
        .body-item {
          position: relative;
          max-width: 300px;
          min-width: 120px;
          height: 100px;
          font-size: 12px;
          font-family: Inter-Bold;
          line-height: 16px;
          color: #11142D;
          line-height: 25px;
          box-sizing: border-box;
          border-right: 1px solid rgba(216, 216, 216, 1);
          border-bottom: 1px solid rgba(216, 216, 216, 1);
          vertical-align: top;

          .data-item {
            padding: 5px;
            cursor: pointer;
            min-height: 50px;
          }

          .indicator-data {
            padding: 10px;
            cursor: pointer;
          }

          .sub-level-data {
            padding: 0;
            cursor: pointer;
          }

          .indicator-input {
            height: 100%;

            textarea {
              display: none;
            }
          }

          .user-define-indicator-input {
            height: 100%;
          }

          .my-indicator-input {
            height: 100%;
          }

          .add-criteria {
            cursor: pointer;
            user-select: none;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            svg {
              width: 18px;
              height: 18px;
            }

            .add-text {
              padding: 15px 10px;
              font-size: 13px;
              font-family: Inter-Bold;
              line-height: 24px;
              color: #888996;
            }
          }

          .criteria-data {
            .criteria-parent {
              display: block;

              .criteria-parent-item {
                display: inline-block;
                background: #15C39A;
                opacity: 1;
                border-radius: 4px;
                padding: 0 10px;
                color: #fff;
                margin-bottom: 5px;
                margin-top: 5px;
              }
            }
          }

          .description-input {
            margin-top: 10px;
          }

          .sub-user-input {
            display: inline-block;
            cursor: pointer;
            background: #E7E7E7;
            opacity: 1;
            padding: 3px 10px;
            border-radius: 4px;
            margin-bottom: 5px;
            margin-top: 5px;
            font-size: 12px;
            font-family: Inter-Bold;
            line-height: 20px;
            color: #989898;
          }

          .evidence-data {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            height: 100%;

            .evidence-info {
              cursor: pointer;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;

              .evidence-num {
                padding: 0 5px;
                font-size: 12px;
                font-family: Inter-Bold;
                line-height: 24px;
                color: #11142D;
              }
            }

            .exist-evidence {

              .evidence-num {
                padding: 0 5px;
                font-size: 12px;
                font-family: Inter-Bold;
                line-height: 24px;
                color: #15C39A;
              }

              svg {
                font-size: 12px;
                font-family: Inter-Bold;
                line-height: 24px;
                color: #15C39A;
              }
            }

            .exist-evidence {
              color: #15C39A;
            }
          }
        }

        .big-body-item {
          max-width: 600px !important;
        }

        .body-item:last-child {
          overflow: visible;
        }

        .add-more-header {
          cursor: pointer;
          position: absolute;
          right: -30px;
          font-size: 16px;
          color: #ccc;
          width: 25px;
          height: 25px;
          align-items: center;
          justify-content: center;
          top: 50%;
          margin-top: -15px;

          img.delete-row {
            display: none;
            width: 30px;
          }
        }

        .add-evidence {
          cursor: pointer;
          position: absolute;
          right: -150px;
          font-size: 14px;
          top: 50%;
          margin-top: -20px;
          display: flex;
          align-items: center;
          padding: 6px 10px;
          border: 1px solid #15c39a;
          background: rgba(21, 195, 154, 0.1);
          border-radius: 3px;

          img {
            height: 15px;
          }

          .add-text {
            padding: 0 5px;
            color: rgba(21, 195, 154, 1);
          }
        }
      }

      .body-line:hover {
        img.delete-row {
          display: block;
        }
      }
    }
  }
}

.add-new-line {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  .add-new-line-item {
    padding: 10px 0;
    cursor: pointer;
    color: #888996;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .add-new-line-item:hover {
    color: #15C39A;
  }
}

.add-tag-action {
  margin-top: 20px;
  text-align: right;
}

.add-tag-icon {
  color: #888996;
  align-items: center;
  display: flex;
  justify-content: center;
  cursor: pointer;

  i {
    height: 100%;
  }

  span {
    padding-left: 5px;
    font-size: 12px;
  }
}

.ext-input {
  width: 100%;
  height: 100%;
  border: none;
  box-shadow: none;
}

.evaluation-item {
  background: fade(@primary-color, 10%);
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .checked-flag {
    position: absolute;
    bottom: 10px;
    right: 10px;
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -25px;
    margin-top: -25px;

    i {
      font-size: 20px;
      color: @primary-color;
    }
  }
}

.rubric-modal {
  padding: 0 10px;
  display: flex;
  flex-direction: column;

  .rubric-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .my-modal-header {
      font-family: Inter-Bold;
      font-size: 20px;
      font-weight: 600;
      color: #070707;
      opacity: 1;
      word-break: break-all;
    }

    margin-bottom: 15px;
  }

  .description-text {
    padding-top: 20px;
    padding-bottom: 30px;

    .old-description {
      font-size: 14px;
      font-family: Inter-Bold;
      line-height: 30px;
      color: #11142D;
    }
  }
}

.select-rubric-action {
  padding: 40px 0 20px 0;
  text-align: center;
  margin: auto;

  .my-rubric-btn {
    margin: 0 10px;
  }
}

.my-text-input {
  border: none;
}

.selected-icon {
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin: 0 5px;
  }
}

.min-header-width {
  width: 100px;
}

.sub-level-list {
  display: flex;
  flex-direction: column;
  align-items: center;

  .sub-level-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
    line-height: 40px;
    width: 100%;
    border-bottom: 1px solid #D8D8D8;

    .start-index, .end-index {
      height: 41px;
      margin: 0 15px;
      display: flex;
      align-items: center;
      justify-content: center;

      .select-block {
        display: flex;
        width: 35px;
        align-items: center;
        justify-content: center;
        padding: 0 3px;
        font-size: 18px;
        color: #ccc;

        img {
          width: 20px;
        }
      }
    }
  }
}

.sub-level-desc {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;

  .sub-level-desc-item {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;
    align-items: center;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #D8D8D8;
    padding: 0 10px;

    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
  }
}

.my-century-criteria {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  .criteria-left-name-list {
    display: flex;
    flex-direction: column;
    padding: 0 10px;

    .criteria-left-name-item {
      width: 150px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      margin: 3px 0;
    }

    .no-first-name {
      padding: 0 8px;
      background: #15C39A;
      color: #fff;
      opacity: 1;
      border-radius: 4px;
    }
  }

  .criteria-right-description {
    width: 200px;
    display: flex;
    flex-direction: column;

    .edit-description {
      margin: 5px 0;
      text-align: center;
      display: inline-block;
      font-size: 12px;
      background: #E7E7E7;
      opacity: 1;
      border-radius: 4px;
      padding: 3px;
      font-family: Inter-Bold;
      line-height: 20px;
      color: #989898;
      opacity: 1;
    }
  }
}

</style>
