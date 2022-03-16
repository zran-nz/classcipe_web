<template>
  <div class='rubric' @click='handleUpdateHeader'>
    <table class='rubric-table'>
      <thead>
        <!--编辑允许修改变动-->
        <draggable
          v-model='headers'
          tag='tr'
          :disabled='disabledDraggable'
          class='table-header'
          @end='handleDragEnd'
          v-if='mode === this.tableMode.Edit'>
          <th
            v-for='(header, hIndex) in headers'
            :class="{'header-item': true, 'preview-mode': mode === tableMode.Preview, 'min-header-width': [
                       headerType.AchievementLevel,
                     ].indexOf(header.type) !== -1,
                     'criteria-header-width': [
                       headerType.Criteria,
                     ].indexOf(header.type) !== -1, 'medium-header-width' : [
                       headerType.Description
                     ].indexOf(header.type) !== -1 && formType !== tableType.Rubric
            }"
            :key='header.type'
            :data-header="JSON.stringify(header)"
            :data-header-type='header.type'
            :data-header-mode='mode'
            v-if='header.visible'>
            <!-- 1.编辑模式下不显示add evidence-->
            <!-- 2.21世纪表格有非描述项,不显示四个列表格，只显示comment，否则现在四个列表格-->
            <!-- 表头文本-->
            <div @click.stop='handleEditHeader(header)' class='label-text'>

              <span class='header-label'>{{ header.label }}</span>
              <template v-if='header.type === headerType.Novice'>
                <a-tooltip placement='top'>
                  <template slot='title'>
                    Students are introduced to the skills, and can watch others performing it(observation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if='header.type === headerType.Learner'>
                <a-tooltip placement='top'>
                  <template slot='title'>
                    Students copy others who use the skill and use the skill with scaffolding and guidance(emulation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if='header.type === headerType.Practitoner'>
                <a-tooltip placement='top'>
                  <template slot='title'>
                    Students employ the skill confidently and effectively(demonstration)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if='header.type === headerType.Expert'>
                <a-tooltip placement='top'>
                  <template slot='title'>
                    Students can show others how to use the skill and accurately assess how effectively the skill is
                    used(self-regulation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

            </div>
            <!-- 编辑状态下的输入框-->
            <template v-if='header.editing'>
              <div class='label-input'>
                <input
                  v-model='header.label'
                  @click.stop=''
                  @blur='handleUpdateHeader'
                  @keyup.enter='handleUpdateHeader'
                  class='header-input-item' />
              </div>
            </template>

            <template v-if='formType !== tableType.CenturySkills'>
              <div class='add-header-item'>
                <a-tooltip title='Add new level'>
                  <a-icon type='plus-circle' @click='handleAddNewHeader(hIndex)' />
                </a-tooltip>
              </div>
            </template>

            <!-- 表头删除图标-->
            <div class='remove-header' v-if='header.type.startsWith(headerType.UserDefine)'>
              <a-popconfirm
                :title="'Remove Header ?'"
                class='rubric-delete-popconfirm'
                ok-text='Yes'
                @confirm='handleRemoveHeader(header)'
                cancel-text='No'>
                <template slot='icon'>
                  <div class='rubric-big-delete'>
                    <img class='big-delete-icon' src='~@/assets/icons/evaluation/big_delete.png' />
                  </div>
                </template>
                <img src='~@/assets/icons/evaluation/delete.png' class='link-icon' />
              </a-popconfirm>
            </div>

          </th>
        </draggable>

        <!--预览和评估模式下不允许修改变动-->
        <tr class='table-header' v-if='mode !== this.tableMode.Edit'>
          <th
            v-for='(header) in headers'
            :class="{'header-item': true, 'preview-mode': mode === tableMode.Preview}"
            :key='header.type'
            :data-header="JSON.stringify(header)"
            :data-header-type='header.type'
            :data-header-mode='mode'
            v-if='header.visible'>
            <!-- 1.编辑模式、自评、他评下不显示add evidence-->
            <!-- 2.21世纪表格有非描述项,不显示四个列表格，只显示comment，否则现在四个列表格-->
            <!-- 表头文本-->
            <!-- 表头文本-->
            <div class='label-text'>

              <span class='header-label'>{{ header.label }}</span>
              <template v-if='header.type === headerType.Novice'>
                <a-tooltip placement='top'>
                  <template slot='title'>
                    Students are introduced to the skills, and can watch others performing it(observation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if='header.type === headerType.Learner'>
                <a-tooltip placement='top'>
                  <template slot='title'>
                    Students copy others who use the skill and use the skill with scaffolding and guidance(emulation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if='header.type === headerType.Practitoner'>
                <a-tooltip placement='top'>
                  <template slot='title'>
                    Students employ the skill confidently and effectively(demonstration)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if='header.type === headerType.Expert'>
                <a-tooltip placement='top'>
                  <template slot='title'>
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

      <tbody class='table-body'>
        <tr v-for='(item, lIndex) in list' class='body-line' :key='lIndex' :data-row-id='item.rowId' v-show="!(item.hasOwnProperty('isSelectedIBLine') && item.isSelectedIBLine && $store.getters.hiddenIbCurriculumId)" >
          <td
            v-for='(header, hIndex) in headers'
            :class="{'body-item': true, 'big-body-item': formType === tableType.CenturySkills && header.type === headerType.Description}"
            :key="lIndex + '-' + header.type"
            @click='handleClickBodyItem(item, header)'
            v-if='header.visible'
            :data-index='hIndex'
            :data-row-id='item.rowId'
            :data-header-type='header.type'>
            <template v-if='item.hasOwnProperty(header.type)'>

              <!-- 21 Century Criteria-->
              <template v-if='header.type === headerType.Criteria'>
                <template v-if='formType === tableType.CenturySkills'>
                  <template v-if='!item[headerType.Criteria] || !item[headerType.Criteria].name'>
                    <div
                      class='data-item add-criteria'
                      @click.stop='handleAddCriteria(header, item, $event)'
                      v-show='mode === tableMode.Edit'>
                      <add-opacity-icon />
                      <div class='add-text'>Click to choose the objectives</div>
                    </div>
                  </template>
                  <template v-else>
                    <div class='data-item criteria-data' @dblclick.stop='handleAddCriteria(header, item, $event)'>
                      <div class='criteria-name'>
                        {{ item[headerType.Criteria].userInputText ? item[headerType.Criteria].userInputText : item[headerType.Criteria].name }}
                      </div>
                      <span class='edit-description' @click.stop='handleClickEnterCriteria(header, item)' v-if='mode === tableMode.Edit'>
                        Please enter explanation for students to understand
                      </span>
                    </div>
                  </template>
                </template>
                <template v-if='formType === tableType.Rubric'>
                  <template v-if='!item[headerType.Criteria].isSelfInput && !item[headerType.Criteria].name'>
                    <div
                      @click.stop=''
                      class='data-item add-criteria-option'
                      :data-is-self-input='item[headerType.Criteria].isSelfInput'
                      v-show='mode === tableMode.Edit'>
                      <div class='create-option-select' @click='handleAddCriteria(header, item, $event)'>
                        <add-opacity-icon />
                        <div class='add-text'>Click to choose the objectives</div>
                      </div>
                      <div class='create-option-input' @click='handleInputIBCriteria(header, item, $event)'>
                        <a-icon type="edit" :style="{ fontSize: '18px'}" />
                        <div class='add-text'>Enter customized content</div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if='item[headerType.Criteria].isSelfInput && mode === tableMode.Edit'>
                    <div class='add-criteria-input' @click.stop=''>
                      <a-textarea
                        style='height: 100%'
                        placeholder='Enter'
                        class='my-text-input'
                        v-model='item[headerType.Criteria].name' />
                    </div>
                  </template>
                  <template v-else>
                    <div class='data-item criteria-data' @dblclick='handleAddCriteria(header, item, $event)'>
                      <div class='criteria-name'>
                        {{ item[headerType.Criteria].name }}
                      </div>
                    </div>
                  </template>
                </template>
                <template v-if='formType === tableType.Rubric_2'>
                  <div class='data-item criteria-data'>
                    <div class='criteria-name'>
                      {{ item[headerType.Criteria].name }}
                    </div>
                  </div>
                </template>
              </template>

              <!-- Description rubric_2的description支持选择-->
              <template v-if='header.type === headerType.Description'>
                <template v-if='formType === tableType.Rubric_2'>
                  <template v-if='!item[headerType.Description] || !item[headerType.Description].name'>
                    <div
                      class='data-item add-criteria'
                      @click='handleAddCriteria(header, item, $event)'
                      v-show='mode === tableMode.Edit'>
                      <add-opacity-icon />
                      <div class='add-text'>Click to choose the objectives</div>
                    </div>
                  </template>
                  <template v-else>
                    <div class='data-item criteria-data' @dblclick='handleAddCriteria(header, item, $event)'>
                      <div class='criteria-name'>
                        {{ item[headerType.Description].name }}
                      </div>
                    </div>
                  </template>
                </template>
                <template v-if='formType === tableType.CenturySkills'>
                  <template v-if='!item[headerType.Description] || !item[headerType.Description].name'>
                    <div
                      class='data-item add-criteria'
                      @click='handleAddCriteria(header, item, $event)'
                      v-show='mode === tableMode.Edit'>
                      <add-opacity-icon />
                      <div class='add-text'>Click to choose the objectives</div>
                    </div>
                  </template>
                  <template v-else>
                    <div class='data-item criteria-data'>
                      <div class='criteria-name my-century-criteria' @dblclick='handleAddCriteria(header, item, $event)'>
                        <div class='criteria-left-name-list'>
                          <div
                            :class="{'criteria-left-name-item': true, 'first-left-name': nIndex === 0, 'no-first-name': nIndex > 0}"
                            v-for='(name, nIndex) in item[headerType.Description].parentNameList'
                            :key='nIndex'>
                            {{ name }}
                          </div>
                        </div>
                        <div class='criteria-right-description'>
                          <div class='description-name'>
                            {{ item[headerType.Description].userInputText ? item[headerType.Description].userInputText : item[headerType.Description].name }}
                          </div>
                          <span class='edit-description' @click.stop='handleClickEnterCriteriaDescription(header, item)' v-if='mode === tableMode.Edit && !($store.getters.bindCurriculum === AllCurriculums.AU || $store.getters.bindCurriculum === AllCurriculums.NZ)'>
                            Please enter explanation for students to understand
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                </template>
              </template>
            </template>

            <template v-if='mode === tableMode.Edit'>
              <template v-if='header.type === headerType.Novice'>
                <div class='indicator-input'>
                  <a-textarea
                    style='height: 100%'
                    placeholder='Enter'
                    class='my-text-input'
                    v-model='item[headerType.Novice].name'
                    @blur='handleUpdateField(header, item)' />
                </div>
              </template>
              <template v-if='header.type === headerType.Learner'>
                <div class='indicator-input'>
                  <a-textarea
                    style='height: 100%'
                    placeholder='Enter'
                    class='my-text-input'
                    v-model='item[headerType.Learner].name'
                    @blur='handleUpdateField(header, item)' />
                </div>
              </template>
              <template v-if='header.type === headerType.Practitoner'>
                <div class='indicator-input'>
                  <a-textarea
                    style='height: 100%'
                    placeholder='Enter'
                    class='my-text-input'
                    v-model='item[headerType.Practitoner].name'
                    @blur='handleUpdateField(header, item)' />
                </div>
              </template>
              <template v-if='header.type === headerType.Expert'>
                <div class='indicator-input'>
                  <a-textarea
                    style='height: 100%'
                    placeholder='Enter'
                    class='my-text-input'
                    v-model='item[headerType.Expert].name'
                    @blur='handleUpdateField(header, item)' />
                </div>
              </template>
              <template v-if='header.type === headerType.Comment'>
                <div class='comment-indicator-input'>
                  <a-textarea
                    style='height: 100%'
                    placeholder=''
                    class='my-text-input'
                    v-model='item[headerType.Comment].name'
                    @blur='handleUpdateField(header, item)' />
                </div>
              </template>

              <!-- UserDefine-->
              <template v-if='header.type.startsWith(headerType.UserDefine)'>
                <div class='user-define-indicator-input'>
                  <a-textarea
                    style='height: 100%'
                    placeholder='Enter'
                    class='my-text-input'
                    v-model='item[header.type].name'
                    @blur='handleUpdateField(header, item)' />
                </div>
              </template>
            </template>

            <!-- AchievementLevel-->
            <template v-if='header.type === headerType.AchievementLevel'>
              <div
                class='sub-level-data'
                :data='JSON.stringify(formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId])'>
                <div class='sub-level-list' :data-mode='mode'>
                  <div
                    class='sub-level-item'
                    v-for='(subLevel, sIndex) in item[headerType.AchievementLevel].subLevelDescription'
                    :key='sIndex'>
                    <template v-if='mode === tableMode.Edit'>
                      <div class='start-index' @click.stop='handleSwitchModeTips'>
                        <div class='select-block'>
                          <a-icon
                            class='select-block-icon'
                            type='border' />
                        </div>
                        {{ subLevel.startIndex }}
                      </div>
                      <div class='end-index' @click.stop='handleSwitchModeTips' v-show='subLevel.endIndex !== null'>
                        <div class='select-block'>
                          <a-icon
                            class='select-block-icon'
                            type='border' />
                        </div>
                        {{ subLevel.endIndex }}
                      </div>
                    </template>
                    <template v-if='mode !== tableMode.Edit'>
                      <div class='start-index'>
                        <div
                          class='select-block'
                          @click.stop='handleClickSubLevelItem(item, header, subLevel.startIndex)'>
                          <img
                            src='~@/assets/icons/lesson/selected.png'
                            v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].data === subLevel.startIndex' />
                          <a-icon
                            class='select-block-icon'
                            type='border'
                            v-else />
                        </div>
                        {{ subLevel.startIndex }}
                      </div>
                      <div
                        class='end-index'
                        @click.stop='handleClickSubLevelItem(item, header, subLevel.endIndex)'
                        v-show='subLevel.endIndex !== null'>
                        <div class='select-block'>
                          <img
                            src='~@/assets/icons/lesson/selected.png'
                            v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].data === subLevel.endIndex' />
                          <a-icon
                            class='select-block-icon'
                            type='border'
                            v-else />
                        </div>
                        {{ subLevel.endIndex }}
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <div
                class='selected-icon'
                v-if='header.type !== headerType.AchievementLevel &&
                  header.type !== headerType.LevelDescriptor &&
                  header.type !== headerType.Indicators'>
                <teacher-icon
                  v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                <student-icon
                  v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                <peer-icon
                  v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.PeerEvaluate)' />
              </div>
            </template>

            <!-- LevelDescriptor-->
            <template v-if='header.type === headerType.LevelDescriptor'>
              <div class='sub-level-data' @click.stop=''>
                <div class='sub-level-desc'>
                  <template v-if='!item[headerType.AchievementLevel].isSelfInput || mode !== tableMode.Edit'>
                    <div
                      class='sub-level-desc-item'
                      v-for='(subLevel, sIndex) in item[headerType.AchievementLevel].subLevelDescription'
                      :key='sIndex'>
                      <a-tooltip placement='topLeft'>
                        <template slot='title'>
                          {{ subLevel.description }}
                        </template>
                        {{ subLevel.description }}
                      </a-tooltip>
                    </div>
                  </template>
                  <template v-if='item[headerType.AchievementLevel].isSelfInput && mode === tableMode.Edit'>
                    <div
                      class='sub-level-desc-input-item'
                      v-for='(subLevel, sIndex) in item[headerType.AchievementLevel].subLevelDescription'
                      :key='sIndex'>
                      <a-input v-model='subLevel.description' class='my-desc-input'/>
                    </div>
                  </template>
                </div>
              </div>
              <div class='selected-icon'>
                <teacher-icon
                  v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                <student-icon
                  v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                <peer-icon
                  v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.PeerEvaluate)' />
              </div>
            </template>

            <!-- Indicators-->
            <template v-if='header.type === headerType.Indicators && mode === tableMode.Edit'>
              <div class='sub-level-data' @click.stop=''>
                <div class='sub-level-indicator'>
                  <div
                    class='sub-level-indicator-item'
                    v-for='(subIndicator, sIndex) in item[headerType.Indicators].subLevelIndicators'
                    :key='sIndex'>
                    <a-input v-model='subIndicator.indicator' class='my-indicator-input'/>
                  </div>
                </div>
              </div>
              <div class='selected-icon'>
                <teacher-icon
                  v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                <student-icon
                  v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                <peer-icon
                  v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.PeerEvaluate)' />
              </div>
            </template>

            <!-- 老师可以看到所有的评估数据，学生自评可以看到自己的和教师的，他评只能看到自己的-->
            <template
              v-if='mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate || mode === tableMode.PeerEvaluate'>
              <!-- Indicators-->
              <!-- Indicators-->
              <template v-if='header.type === headerType.Indicators'>
                <div class='sub-level-data' @click.stop=''>
                  <div class='sub-level-indicator'>
                    <div
                      class='sub-level-indicator-item'
                      v-for='(subIndicator, sIndex) in item[headerType.Indicators].subLevelIndicators'
                      :key='sIndex'>
                      <div class='my-indicator-text'>
                        {{ subIndicator && subIndicator.indicator ? subIndicator.indicator : '' }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class='selected-icon'>
                  <teacher-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                  <student-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                  <peer-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.PeerEvaluate)' />
                </div>
              </template>
              <template v-if='header.type === headerType.Novice'>
                <div class='indicator-data'>
                  {{ item[headerType.Novice].name }}
                </div>
                <div class='selected-icon'>
                  <teacher-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                  <student-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                  <peer-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.PeerEvaluate)' />
                </div>
              </template>
              <template v-if='header.type === headerType.Learner'>
                <div class='indicator-data'>
                  {{ item[headerType.Learner].name }}
                </div>
                <div class='selected-icon'>
                  <teacher-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                  <student-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                  <peer-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.PeerEvaluate)' />
                </div>
              </template>
              <template v-if='header.type === headerType.Practitoner'>
                <div class='indicator-data'>
                  {{ item[headerType.Practitoner].name }}
                </div>
                <div class='selected-icon'>
                  <teacher-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                  <student-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                  <peer-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.PeerEvaluate)' />
                </div>
              </template>
              <template v-if='header.type === headerType.Expert'>
                <div class='indicator-data'>
                  {{ item[headerType.Expert].name }}
                </div>
                <div class='selected-icon'>
                  <teacher-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                  <student-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                  <peer-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.PeerEvaluate)' />
                </div>
              </template>
              <template v-if='header.type === headerType.Comment'>
                <div class='comment-indicator-input'>
                  <a-textarea
                    style='height: 100%'
                    placeholder=''
                    class='my-text-input'
                    v-model='item[headerType.Comment].name'
                    @blur='handleUpdateField(header, item)' />
                </div>
              </template>

              <!-- UserDefine-->
              <template v-if='header.type.startsWith(headerType.UserDefine)'>
                <div class='indicator-data'>
                  {{ item[header.type].name }}
                </div>
                <div class='selected-icon'>
                  <teacher-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].teacherEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                  <student-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].studentEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate)' />
                  <peer-icon
                    v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].peerEvaluation === header.type && (mode === tableMode.TeacherEvaluate || mode === tableMode.PeerEvaluate)' />
                </div>
              </template>
            </template>

            <!-- Evidence 仅在评估模式下显示-->
            <template
              v-if='header.type === headerType.Evidence && (mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate || mode === tableMode.PeerEvaluate)'>
              <div class='evidence-data'>
                <template v-if='formBodyData && formBodyData[item.rowId] && formBodyData[item.rowId].evidenceIdList'>
                  <div
                    :class="{'evidence-info': true, 'exist-evidence': item[headerType.Evidence].num}"
                    @click='handleAddEvidenceLine(lIndex, item, $event)'
                    v-show='mode === tableMode.TeacherEvaluate || mode === tableMode.StudentEvaluate'>
                    <add-icon v-show='!formBodyData[item.rowId].evidenceIdList.length' />
                    <add-small-green-icon v-show='formBodyData[item.rowId].evidenceIdList.length' />
                    <div class='evidence-num'>(
                      {{ formBodyData[item.rowId].evidenceIdList.length ? formBodyData[item.rowId].evidenceIdList.length : 0 }} )
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </td>

          <template v-if='mode === tableMode.Edit'>
            <div class='add-more-header'>
              <a-popconfirm
                :title="'Delete this line ?'"
                class='rubric-delete-popconfirm'
                ok-text='Yes'
                @confirm='handleDeleteLine(item)'
                cancel-text='No'>
                <template slot='icon'>
                  <div class='rubric-big-delete'>
                    <img class='big-delete-icon' src='~@/assets/icons/evaluation/big_delete.png' />
                  </div>
                </template>
                <img src='~@/assets/icons/evaluation/delete.png' class='delete-row' />
              </a-popconfirm>
            </div>
          </template>
        </tr>
      </tbody>
    </table>
    <div class='add-new-line' @click='handleAddNewLine' v-if='mode === tableMode.Edit'>
      <div class='add-new-line-item'>
        <add-green-icon />
      </div>
    </div>

    <a-modal
      v-model='selectCurriculumVisible'
      @ok='handleEnsureSelectCriteria'
      destroyOnClose
      width='1200px'
      :dialog-style="{ top: '20px' }"
      :footer='null'>
      <div class='associate-library'>
        <new-browser
          :select-mode='selectModel.evaluationMode'
          :show-menu='showMenuList'
          :default-active-menu='defaultActiveMenu'
          @select-all-21-century='handleSelectAll21CenturyListData'
          @select-curriculum='handleSelectCurriculumListData'
          @select-subject-specific-skill='handleSelectSubjectSpecificSkillListData'
          @select-century-skill='handleSelect21CenturySkillListData'
          @select-assessmentType='handleSelectAssessmentType'
          @select-idu='handleSelectIdu'
          @ensure-select='handleEnsureSelectCriteria'
          question-index='evaluation_' />
      </div>
    </a-modal>

    <a-modal
      v-model='inputDescriptionVisible'
      :footer='null'
      :maskClosable='false'
      :closable='false'
      width='700px'
      destroyOnClose>
      <modal-header @close='inputDescriptionVisible = false' />
      <div class='rubric-modal'>
        <div class='rubric-header'>
          <div class='my-modal-header'>
            The specific description you entered will be shown to students instead of the curriculum description
          </div>
        </div>
        <div class='description-text'>
          <div class='old-description' v-if='currentEnterDescriptionLine'>
            {{ currentEnterDescriptionLine[headerType.Description].name }}
          </div>
          <div class='old-description' v-if='currentEnterCriteriaLine'>
            {{ currentEnterCriteriaLine[headerType.Criteria].name }}
          </div>
        </div>
        <div class='description-input'>
          <a-textarea
            placeholder='Enter task specific description'
            :autoSize='{ minRows: 3, maxRows: 6 }'
            v-model='inputDescription'
            @blur='handleUpdateDescription' />
        </div>
        <div class='select-rubric-action'>
          <a-button
            shape='round'
            class='my-rubric-btn'
            style='width: 80px;background-color: #F5F5F5; border-color:#F5F5F5;box-shadow: none; color: #000000 '
            type='primary'
            @click='handleCancelDescription'>Cancel
          </a-button>
          <a-button
            shape='round'
            class='my-rubric-btn'
            style='width: 80px;'
            type='primary'
            @click='handleEnsureDescription'>Confirm
          </a-button>
        </div>
      </div>
    </a-modal>

  </div>
</template>

<script>

import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
import { SelectModel } from '@/components/NewLibrary/SelectModel'
import { AllCurriculums } from '@/const/common'
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
    mode: {
      type: String,
      required: true
    },
    formType: {
      type: Number,
      required: true
    },
    formBodyData: {
      type: Object,
      default: () => null
    },
    taskLearnOuts: {
      type: Array,
      default: () => []
    },
    taskSelfOuts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectModel: SelectModel,
      selfHeaderAddIndex: 1,
      headers: [], // 表头
      list: [], // 表结构数据
      defaultActiveMenu: NavigationType.specificSkills,
      showMenuList: [NavigationType.centurySkills],

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
      currentEnterCriteriaLine: null,

      disabledDraggable: false,

      selected21CenturyItem: null,
      has21CenturySkillNoDescriptionItem: false, // 是否有选择21世纪技能非描述的项目

      AllCurriculums: AllCurriculums
    }
  },
  watch: {
    list(list) {
      let flag = false
      if (this.formType === this.tableType.CenturySkills) { // 只正对21世纪技能表
        list.forEach(item => {
          if (item.hasOwnProperty(this.headerType.Description)) {
            if (item[this.headerType.Description].isDescription === false) {
              this.$logger.info('!!! has21CenturySkillNoDescriptionItem', item)
              flag = true
            }
          }
        })
      }
      this.has21CenturySkillNoDescriptionItem = flag

      // 编辑与他评模式不显示evidence
      if (this.mode === this.tableMode.TeacherEvaluate) {
        this.headers.forEach(header => {
          if (header.type === this.headerType.Evidence) {
            header.visible = true
          }
        })
      } else {
        this.headers.forEach(header => {
          if (header.type === this.headerType.Evidence) {
            header.visible = false
          }
        })
      }

      // 21世纪有非描述性不显示后四列，改为显示comment
      if (this.formType === this.tableType.CenturySkills) { // 只正对21世纪技能表
         if (flag) {
           this.headers.forEach(header => {
             if (header.type === this.headerType.Comment) {
               header.visible = true
             } else if ([
               this.headerType.Novice,
               this.headerType.Learner,
               this.headerType.Practitoner,
               this.headerType.Expert
             ].indexOf(header.type) !== -1) {
               header.visible = false
             }
           })
         } else {
          this.headers.forEach(header => {
            if (header.type === this.headerType.Comment) {
              header.visible = false
            } else if ([
              this.headerType.Novice,
              this.headerType.Learner,
              this.headerType.Practitoner,
              this.headerType.Expert
            ].indexOf(header.type) !== -1) {
              header.visible = true
            }
          })
         }
      }
    }
  },
  created() {
    this.$logger.info('[' + this.mode + '] EvaluationTable created formType ' + this.formType, 'initRawHeaders', this.initRawHeaders, 'initRawData', this.initRawData, ' formBodyData', this.formBodyData)

    // 评估模式参数校验
    if ([
      EvaluationTableMode.Edit,
      EvaluationTableMode.Preview,
      EvaluationTableMode.TeacherEvaluate,
      EvaluationTableMode.StudentEvaluate,
      EvaluationTableMode.PeerEvaluate
    ].indexOf(this.mode) === -1) {
      this.$confirm({
        title: 'Parameter error',
        content: 'Please make sure your link is correct, the current evaluation mode is ' + this.mode + '.',
        centered: true,
        onOk: () => {
          this.$emit('error-mode')
        },
        onCancel: () => {
          this.$emit('error-mode')
        }
      })
    }
    // 只有老师才可以进入老师评价模式
    if (this.mode === EvaluationTableMode.TeacherEvaluate && this.$store.getters.currentRole !== 'teacher') {
      this.$confirm({
        title: 'Access denied',
        content: 'Only teachers have access to teacher mode',
        centered: true,
        onOk: () => {
          this.$emit('error-mode')
        },
        onCancel: () => {
          this.$emit('error-mode')
        }
      })
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
            required: true,
            visible: true
          },
          {
            label: 'Achievement Level',
            previewLabel: 'Achievement Level',
            type: EvaluationTableHeader.AchievementLevel,
            editable: false,
            editing: false,
            required: true,
            visible: true
          },
          {
            label: 'Level descriptor',
            previewLabel: 'Level descriptor',
            type: EvaluationTableHeader.LevelDescriptor,
            editable: false,
            editing: false,
            required: true,
            visible: true
          },
          {
            label: 'Task specific indicators',
            previewLabel: 'Task specific indicators',
            type: EvaluationTableHeader.Indicators,
            editable: false,
            editing: false,
            required: true,
            visible: true
          },
          {
            label: 'Evidence',
            previewLabel: 'Evidence',
            type: EvaluationTableHeader.Evidence,
            editable: false,
            editing: false,
            required: true,
            visible: true
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
            required: true,
            visible: true
          },
          {
            label: 'Unnamed level',
            previewLabel: 'Unnamed level',
            type: EvaluationTableHeader.UserDefine,
            editable: true,
            editing: false,
            required: false,
            visible: true
          },
          {
            label: 'Evidence',
            previewLabel: 'Evidence',
            type: EvaluationTableHeader.Evidence,
            editable: false,
            editing: false,
            required: true,
            visible: true
          }
        ]
      } else if (this.formType === EvaluationTableType.CenturySkills) {
        /**
         *  第三种表需要针对NZ和AU用户在最左侧添加一列命名为Criteria
         Cambridge/IB/IGCSE的用户只看到第二列，点击后看到21st Century Skills数据入口
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
              required: true,
              visible: true
            },
            {
              label: '21st Century Skills',
              previewLabel: '21st Century Skills',
              type: EvaluationTableHeader.Description,
              editable: false,
              editing: false,
              required: true,
              visible: true
            },
            {
              label: 'Novice',
              previewLabel: 'Novice',
              type: EvaluationTableHeader.Novice,
              editable: false,
              editing: false,
              required: true,
              visible: true
            },
            {
              label: 'Learner',
              previewLabel: 'Learner',
              type: EvaluationTableHeader.Learner,
              editable: false,
              editing: false,
              required: true,
              visible: true
            },
            {
              label: 'Practitoner',
              previewLabel: 'Practitoner',
              type: EvaluationTableHeader.Practitoner,
              editable: false,
              editing: false,
              required: true,
              visible: true
            },
            {
              label: 'Expert',
              previewLabel: 'Expert',
              type: EvaluationTableHeader.Expert,
              editable: false,
              editing: false,
              required: true,
              visible: true
            },
            {
              label: 'Comment',
              previewLabel: 'Comment',
              type: EvaluationTableHeader.Comment,
              editable: false,
              editing: false,
              required: true,
              visible: true
            },
            {
              label: 'Evidence',
              previewLabel: 'Evidence',
              type: EvaluationTableHeader.Evidence,
              editable: false,
              editing: false,
              required: true,
              visible: true
            }
          ]
        } else {
          this.headers = [
            {
              label: '21st Century Skills',
              previewLabel: '21st Century Skills',
              type: EvaluationTableHeader.Description,
              editable: false,
              editing: false,
              required: true,
              visible: true
            },
            {
              label: 'Novice',
              previewLabel: 'Novice',
              type: EvaluationTableHeader.Novice,
              editable: false,
              editing: false,
              required: true,
              visible: true
            },
            {
              label: 'Learner',
              previewLabel: 'Learner',
              type: EvaluationTableHeader.Learner,
              editable: false,
              editing: false,
              required: true,
              visible: true
            },
            {
              label: 'Practitoner',
              previewLabel: 'Practitoner',
              type: EvaluationTableHeader.Practitoner,
              editable: false,
              editing: false,
              required: true,
              visible: true
            },
            {
              label: 'Expert',
              previewLabel: 'Expert',
              type: EvaluationTableHeader.Expert,
              editable: false,
              editing: false,
              required: true,
              visible: true
            },
            {
              label: 'Comment',
              previewLabel: 'Comment',
              type: EvaluationTableHeader.Comment,
              editable: false,
              editing: false,
              required: true,
              visible: true
            },
            {
              label: 'Evidence',
              previewLabel: 'Evidence',
              type: EvaluationTableHeader.Evidence,
              editable: false,
              editing: false,
              required: true,
              visible: true
            }
          ]
        }
      }
    }
    this.$logger.info('[' + this.mode + '] form headers ', this.headers)

    if (this.initRawData.length) {
      this.list = this.initRawData
    } else if (!this.$store.getters.isIBTeacher && (this.taskLearnOuts.length || this.taskSelfOuts.length)) {
      this.handleAddNewLineWithTaskOuts()
    } else {
      this.handleAddNewLine()
    }
    LibraryEventBus.$on(LibraryEvent.ContentListSelectClick, this.handleContentListSelectClick)
    LibraryEventBus.$on(LibraryEvent.CenturySkillsSelect, this.handleCenturySkillsSelect)
    LibraryEventBus.$on(LibraryEvent.CancelCenturySkillsSelect, this.handleCancelCenturySkillsSelect)
  },
  destroyed() {
    LibraryEventBus.$off(LibraryEvent.ContentListSelectClick, this.handleContentListSelectClick)
    LibraryEventBus.$off(LibraryEvent.CenturySkillsSelect, this.handleCenturySkillsSelect)
    LibraryEventBus.$off(LibraryEvent.CancelCenturySkillsSelect, this.handleCancelCenturySkillsSelect)
    this.$logger.info('[' + this.mode + '] off NewClickableKnowledgeTag ContentListSelectClick handler')
  },
  methods: {

    handleContentListSelectClick(data) {
      if (data.questionIndex === 'evaluation_') {
        this.$logger.info('[' + this.mode + '] evaluation handleContentListSelectClick hit', data)
        LibraryEventBus.$emit(LibraryEvent.ContentListSelectedListUpdate, { id: data.subKnowledgeId })
      }
    },

    handleEditHeader(header) {
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

    handleUpdateHeader() {
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

    handleAddNewHeader(hIndex) {
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
        label: 'Unnamed Level ',
        previewLabel: 'Unnamed Level ',
        type: userDefineHeaderType,
        editable: true,
        editing: false,
        visible: true
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

    handleRemoveHeader(header) {
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

    handleAddNewLine() {
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
          parentNameList: [],
          isDescription: true
        }

        newLineItem[this.headerType.Evidence] = {
          num: 0,
          selectedList: [],
          selectedStudentList: [],
          rowId
        }
      } else if (this.formType === this.tableType.Rubric) {
        newLineItem.isSelectedIBLine = false // 是否是ib大纲数据行
        newLineItem.isSelfInputLine = false // 是否用户自定义输入行
        newLineItem[this.headerType.Criteria] = {
          rowId,
          name: null,
          isSelfInput: false
        }

        newLineItem[this.headerType.AchievementLevel] = {
          rowId,
          subLevelDescription: [],
          isSelfInput: false
        }

        newLineItem[this.headerType.Indicators] = {
          rowId,
          subLevelIndicators: [],
          isSelfInput: false
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

    handleAddNewLineWithTaskOuts () {
      this.$logger.info('[' + this.mode + '] handleAddNewLineWithTaskOuts ', this.taskLearnOuts, this.taskSelfOuts)
      const totalOuts = this.taskLearnOuts.concat(this.taskSelfOuts)
      totalOuts.forEach(outItem => {
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
            name: outItem.name,
            rowId,
            parentNameList: outItem.parentNameList,
            isDescription: true
          }

          newLineItem[this.headerType.Evidence] = {
            num: 0,
            selectedList: [],
            selectedStudentList: [],
            rowId
          }
          this.$logger.info('[' + this.mode + '] init new line ', newLineItem)
          this.list.push(newLineItem)
        } else if (this.formType === this.tableType.Rubric_2) {
          newLineItem[this.headerType.Description].name = outItem.name
          newLineItem[this.headerType.Evidence] = {
            num: 0,
            selectedList: [],
            selectedStudentList: [],
            rowId
          }
          this.$logger.info('[' + this.mode + '] init new line ', newLineItem)
          this.list.push(newLineItem)
        }
      })
    },
    handleDragEnd() {
      this.$logger.info('[' + this.mode + '] handleDragEnd', this.headers)
    },

    handleDeleteLine(deleteLine) {
      this.$logger.info('[' + this.mode + '] handleDeleteLine', deleteLine)
      if (this.mode === EvaluationTableMode.Edit) {
        this.list = this.list.filter(item => item !== deleteLine)
      }
    },

    handleClickBodyItem(item, header) {
      this.$logger.info('[' + this.mode + '][' + this.mode + '] handleClickBodyItem ' + header.label, item, 'header', header)
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
          evaluationMode: this.mode,
          rowId: item.rowId,
          value: header.type, // 评价所选的列
          evaluateUserEmail: this.$store.getters.email,
          evaluateUserName: this.$store.getters.nickname,
          data: null
        })
      }
    },

    handleClickSubLevelItem(item, header, subLevel) {
      this.$logger.info(subLevel + ' [' + this.mode + '][' + this.mode + '] handleClickSubLevelItem ' + header.label, item, 'header', header)
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
          evaluationMode: this.mode,
          rowId: item.rowId,
          value: header.type, // 评价所选的列
          evaluateUserEmail: this.$store.getters.email,
          evaluateUserName: this.$store.getters.nickname,
          data: subLevel
        })
      }
    },

    handleSwitchModeTips() {
      this.$message.warn('Please switch to evaluation mode first!')
    },

    handleAddCriteria(header, item, event) {
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
           Cambridge/IB/IGCSE的用户只看到第二列，点击后看到21st Century Skills数据入口
           NZ和AU的用户在第一列criteria列点击后看到
           NZ-Key competencies
           AU-General capabilities的入口，然后在第二列点击后看到21st Century Skills数据入口
           */
          const bindCurriculum = parseInt(this.$store.getters.bindCurriculum)
          this.$logger.info('CenturySkills header.type ' + header.type, header.type === this.headerType.Description, header.type === this.headerType.Criteria)
          if (header.type === this.headerType.Description) {
            if (bindCurriculum === 1 || bindCurriculum === 2) {
              this.showMenuList = [NavigationType.all21Century]
              this.defaultActiveMenu = NavigationType.all21Century
            } else {
              this.showMenuList = [NavigationType.centurySkills]
              this.defaultActiveMenu = NavigationType.centurySkills
            }
          } else if (header.type === this.headerType.Criteria) {
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

    handleInputIBCriteria (header, item, event) {
      event.preventDefault()
      event.stopPropagation()
      this.$logger.info('handleInputIBCriteria ')
      this.currentSelectHeader = header
      this.currentSelectLine = item

      this.currentSelectLine.isSelectedIBLine = false
      this.currentSelectLine.isSelfInputLine = true
      this.currentSelectLine[this.headerType.Criteria] = {
        name: '',
        rowId: this.currentSelectLine.rowId,
        isSelfInput: true
      }

      const subLevelDescription = []
      for (let i = 0; i < 8; i++) {
        if (i === 0 || i % 2 === 1) {
          subLevelDescription.push({
            startIndex: i,
            endIndex: i === 0 ? null : i + 1,
            description: ''
          })
        }
      }
      this.currentSelectLine[this.headerType.AchievementLevel] = {
        name: '',
        rowId: this.currentSelectLine.rowId,
        subLevelDescription,
        isSelfInput: true
      }

      const subLevelIndicators = []
      for (let i = 0; i < 5; i++) {
        subLevelIndicators.push({
          indicator: ''
        })
      }
      this.currentSelectLine[this.headerType.Indicators] = {
        rowId: this.currentSelectLine.rowId,
        subLevelIndicators,
        isSelfInput: true
      }

      this.$logger.info('self input currentSelectLine with criteria data ', this.currentSelectLine)
    },

    handleEnsureSelectCriteria() {
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

      if (this.selected21CenturyItem) {
        const parentNameList = []
        let parent = this.selected21CenturyItemParent
        let count = 3
        while (parent && count-- > 0) {
          parentNameList.push(parent.name)
          parent = parent.parent
        }
        const descriptionItem = {
          name: this.selected21CenturyItem.name,
          parentNameList: parentNameList,
          isDescription: false // 标识选择任意非描述项
        }
        selectedList.push(descriptionItem)
        this.$logger.info('selectedList add selected21CenturyItem', descriptionItem)
      }

      this.$logger.info('formType ' + this.formType + ' selectedList', selectedList)
      if (this.formType === this.tableType.CenturySkills) {
        if (selectedList.length >= 1) {
          /**
           *  第三种表需要针对NZ和AU用户在最左侧添加一列命名为Criteria
           Cambridge/IB/IGCSE的用户只看到第二列，点击后看到21st Century Skills数据入口
           NZ和AU的用户在第一列criteria列点击后看到
           NZ-Key competencies
           AU-General capabilities的入口，然后在第二列点击后看到21st Century Skills数据入口
           */
          const header = Object.assign(this.currentSelectHeader)
          if (header.type === this.headerType.Description) {
            this.currentSelectLine[this.headerType.Description] = {
              name: selectedList[0].name,
              rowId: this.currentSelectLine.rowId,
              parentNameList: selectedList[0].parentNameList,
              isDescription: selectedList[0].isDescription
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
                    parentNameList: item.parentNameList,
                    isDescription: item.isDescription
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

        this.list = this.list.filter(item => (!item.description || item.description.name) || (!item.criteria || item.criteria.name))
        this.$logger.info('CenturySkills 过滤掉没有Description的行', this.list)
      } else if (this.formType === this.tableType.Rubric) {
        if (selectedList.length >= 1) {
          // 如果只选择了一个，使用第一个填充当前行数据
          this.currentSelectLine.isSelectedIBLine = true
          this.currentSelectLine.isSelfInputLine = false
          this.currentSelectLine[this.headerType.Criteria] = {
            name: selectedList[0].name,
            rowId: this.currentSelectLine.rowId,
            isSelfInput: false
          }

          this.currentSelectLine[this.headerType.AchievementLevel] = {
            name: selectedList[0].name,
            rowId: this.currentSelectLine.rowId,
            subLevelDescription: selectedList[0].subLevelDescription,
            isSelfInput: false
          }

          const subLevelIndicators = []
          selectedList[0].subLevelDescription.forEach(item => {
            subLevelIndicators.push({
              indicator: ''
            })
          })
          this.currentSelectLine[this.headerType.Indicators] = {
            rowId: this.currentSelectLine.rowId,
            subLevelIndicators,
            isSelfInput: false
          }

          this.$logger.info('[' + this.mode + '] update currentSelectLine with criteria data ', this.currentSelectLine)

          // 如果多选，从第二个元素开始新建行填充数据
          if (selectedList.length > 1) {
            selectedList.forEach((descriptionItem, index) => {
              if (index > 0) {
                const newLineItem = {}
                const rowId = this.generateRowId()
                newLineItem.rowId = rowId
                newLineItem.isSelectedIBLine = true
                newLineItem.isSelfInputLine = false

                this.headers.forEach(header => {
                  newLineItem[header.type] = {
                    name: null,
                    rowId
                  }
                })
                newLineItem[this.headerType.Criteria] = {
                  name: descriptionItem.name,
                  rowId,
                  isSelfInput: false
                }

                newLineItem[this.headerType.AchievementLevel] = {
                  name: descriptionItem.name,
                  rowId,
                  subLevelDescription: descriptionItem.subLevelDescription,
                  isSelfInput: false
                }

                const subLevelIndicators = []
                selectedList[0].subLevelDescription.forEach(item => {
                  subLevelIndicators.push({
                    indicator: ''
                  })
                })
                newLineItem[this.headerType.Indicators] = {
                  rowId: this.currentSelectLine.rowId,
                  subLevelIndicators,
                  isSelfInput: false
                }

                newLineItem[this.headerType.Evidence] = {
                  num: 0,
                  selectedList: [],
                  selectedStudentList: [],
                  rowId
                }

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

    handleUpdateDescription(header, item) {
      this.$logger.info('[' + this.mode + '] handleUpdateDescription', header, item)
    },

    handleUpdateField(header, item) {
      this.$logger.info('[' + this.mode + '] handleUpdateField', header, item)
    },

    handleClickEnterCriteriaDescription(header, item) {
      this.$logger.info('[' + this.mode + '] handleClickEnterCriteriaDescription', header, item)
      if (this.mode === EvaluationTableMode.Edit) {
        this.inputDescription = item[this.headerType.Description].userInputText
        this.currentEnterDescriptionLine = item
        this.inputDescriptionVisible = true
      }
    },

    handleClickEnterCriteria(header, item) {
      this.$logger.info('[' + this.mode + '] handleClickEnterCriteria', header, item)
      if (this.mode === EvaluationTableMode.Edit) {
        this.inputDescription = item[this.headerType.Criteria].userInputText
        this.currentEnterCriteriaLine = item
        this.inputDescriptionVisible = true
      }
    },

    handleEnsureDescription() {
      this.$logger.info('[' + this.mode + '] handleEnsureDescription ' + this.inputDescription)

      if (this.currentEnterDescriptionLine) {
        this.currentEnterDescriptionLine[this.headerType.Description].userInputText = this.inputDescription
      }

      if (this.currentEnterCriteriaLine) {
        this.currentEnterCriteriaLine[this.headerType.Criteria].userInputText = this.inputDescription
      }
      if (this.mode === EvaluationTableMode.Edit) {
        this.inputDescriptionVisible = false
        this.currentEnterDescriptionLine = null
        this.currentEnterCriteriaLine = null
        this.inputDescription = null
      }
    },

    handleCancelDescription() {
      this.$logger.info('[' + this.mode + '] handleEnsureDescription ' + this.inputDescription)
      this.currentEnterDescriptionLine = null
      this.currentEnterCriteriaLine = null
      this.inputDescription = null
      this.inputDescriptionVisible = false
    },

    handleAddEvidenceLine(lIndex, item, event) {
      event.stopPropagation()
      event.preventDefault()
      this.$logger.info('[' + this.mode + '] handleAddEvidenceLine', lIndex, item)
      this.$emit('add-evidence', {
        index: lIndex, data: item
      })
    },
    handleSelectAll21CenturyListData(data) {
      this.$logger.info('[' + this.mode + '] EvaluationTable handleSelectAll21CenturyListData', data)
      const descriptionList = []
      data.forEach(dataItem => {
        const item = dataItem.item
        const parentNameList = []
        let parent = item.originParent
        let count = 3
        while (parent && count-- > 0) {
          parentNameList.push(parent.name)
          parent = parent.originParent
        }
        const descriptionItem = {
          name: dataItem.item.name,
          parentNameList: parentNameList,
          isDescription: true
        }
        descriptionList.push(descriptionItem)
      })
      this.selectedAll21CenturyList = descriptionList
      this.$logger.info('[' + this.mode + '] selectedAll21CenturyList ', descriptionList)
    },

    handleSelectCurriculumListData(data) {
      this.$logger.info('[' + this.mode + '] EvaluationTable handleSelectCurriculumListData', data)
      const descriptionList = []
      data.forEach(dataItem => {
        const descriptionItem = {
          name: dataItem.knowledgeData.name,
          isDescription: true
        }
        descriptionList.push(descriptionItem)
      })
      this.selectedCurriculumList = descriptionList
      this.$logger.info('[' + this.mode + '] handleSelectCurriculumListData ', descriptionList)
    },

    handleSelectSubjectSpecificSkillListData(data) {
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
          subLevelDescription: newSubLevelList,
          isDescription: true
        }

        descriptionList.push(descriptionItem)
      })
      this.selectedSubjectSpecificSkillList = descriptionList
      this.$logger.info('[' + this.mode + '] handleSelectSubjectSpecificSkillListData ', descriptionList)
    },

    handleSelect21CenturySkillListData(data) {
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
          parentNameList: parentNameList,
          isDescription: true
        }

        descriptionList.push(descriptionItem)
      })
      this.selectedCurriculumList = descriptionList
      this.$logger.info('[' + this.mode + '] handleSelectCurriculumListData ', descriptionList)

      // 取消层级的选择
      LibraryEventBus.$emit(LibraryEvent.CancelCenturySkillsSelect)
    },

    handleSelectAssessmentType(data) {
      this.$logger.info('[' + this.mode + '] EvaluationTable handleSelectAssessmentType', data)
      const descriptionList = []
      data.forEach(dataItem => {
        const descriptionItem = {
          name: dataItem.knowledgeData.name,
          isDescription: true
        }

        descriptionList.push(descriptionItem)
      })
      this.selectedAssessmentList = descriptionList
      this.$logger.info('[' + this.mode + '] handleSelectAssessmentType ', descriptionList)
    },

    handleSelectIdu(data) {
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
            description: description,
            isDescription: true
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
    handleCancelSelectData() {
    },

    getTableStructData() {
      this.$logger.info('getTableStructData', this.headers, this.list)
      return {
        headers: this.headers,
        list: this.list,
        formId: this.formId
      }
    },

    generateRowId() {
      let rowId = 'row_' + Math.random()
      while (this.list.findIndex(item => item.rowId === rowId) !== -1) {
        rowId = 'row_' + Math.random()
      }
      this.$logger.info('generateRowId ' + rowId)
      return rowId
    },

    handleCenturySkillsSelect(data) {
      this.$logger.info('NewBrowser handleCenturySkillsSelect', data)
      this.selected21CenturyItem = data.item
      this.selected21CenturyItemParent = data.parent
    },

    handleCancelCenturySkillsSelect() {
      this.selected21CenturyItem = null
      this.selected21CenturyItemParent = null
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
        margin-right: -35px;
        font-size: 20px;
        color: @primary-color;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .table-body {
      border-left: 1px solid rgba(216, 216, 216, 1);

      .body-line {
        height: 100%;
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

          .comment-indicator-input {
            height: 100%;
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

          .add-criteria-option {
            cursor: pointer;
            user-select: none;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;

            .create-option-select, .create-option-input {
              cursor: pointer;
              user-select: none;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;

              svg {
                width: 18px;
                height: 18px;
              }

              .add-text {
                padding: 8px 10px;
                font-size: 13px;
                font-family: Inter-Bold;
                color: #888996;
              }
            }
          }

          .add-criteria-input {
            height: 100%;
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
          margin-right: -35px;
          font-size: 20px;
          color: @primary-color;
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;

          img.delete-row {
            margin-top: 10px;
            padding-left: 10px;
            display: none;
            width: 40px;
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
      word-break: normal;
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
  width: 150px;
}

.criteria-header-width {
  width: 250px;
}

.medium-header-width {
  width: 400px;
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

  :last-child {
    border-bottom: none;
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
    width: 100%;
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

  .sub-level-desc-input-item {
    height: 40px;
    width: 100%;

    .my-desc-input {
      height: 100%;
      border-top: none;
      border-left: none;
      border-right: none;
    }
  }

  .sub-level-desc-item:last-child {
    border-bottom: none;
  }

  .sub-level-desc-input-item:last-child {
    .my-desc-input {
      border-bottom: none;
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

.sub-level-indicator {
  .sub-level-indicator-item:last-child {
    .my-indicator-input {
      border-bottom: none;
    }
    .my-indicator-text {
      border-bottom: none;
    }
  }
}

.sub-level-indicator-item {
  height: 40px;

  .my-indicator-input {
    border-top: none;
    border-left: none;
    border-right: none;
  }

  .my-indicator-text {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #D8D8D8;
    padding: 0 5px;
  }
}
</style>
