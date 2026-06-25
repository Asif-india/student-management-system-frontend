// import React from 'react'
// import { useQuery } from '@tanstack/react-query'
// import { studentService } from '../services/studentService'
// import { teacherService } from '../services/teacherService'
// import { classService } from '../services/classService'
// import { subjectService } from '../services/subjectService'
// import {
//   Users,
//   GraduationCap,
//   Layers,
//   BookOpen,
//   TrendingUp,
//   CheckCircle,
//   Clock,
//   Download,
// } from 'lucide-react'
// import LoadingState from '../components/ui/LoadingState'
// import ErrorState from '../components/ui/ErrorState'

// const Reports: React.FC = () => {
//   const { data: students, isLoading: loadingStudents, error: studentsError } = useQuery({
//     queryKey: ['students'],
//     queryFn: () => studentService.getStudents({ page: 1, limit: 1000 }),
//   })

//   const { data: teachers, isLoading: loadingTeachers, error: teachersError } = useQuery({
//     queryKey: ['teachers'],
//     queryFn: () => teacherService.getTeachers({ page: 1, limit: 1000 }),
//   })

//   const { data: classes, isLoading: loadingClasses, error: classesError } = useQuery({
//     queryKey: ['classes'],
//     queryFn: () => classService.getClasses({ page: 1, limit: 1000 }),
//   })

//   const { data: subjects, isLoading: loadingSubjects, error: subjectsError } = useQuery({
//     queryKey: ['subjects'],
//     queryFn: () => subjectService.getSubjects({ page: 1, limit: 1000 }),
//   })

//   const isLoading = loadingStudents || loadingTeachers || loadingClasses || loadingSubjects
//   const error = studentsError || teachersError || classesError || subjectsError

//   if (isLoading) {
//     return <LoadingState message="Loading reports..." />
//   }

//   if (error) {
//     return <ErrorState message="Failed to load reports data" onRetry={() => window.location.reload()} />
//   }

//   const studentData = students?.data || []
//   const teacherData = teachers?.data || []
//   const classData = classes?.data || []
//   const subjectData = subjects?.data || []

//   const activeStudents = studentData.filter((s) => s.status === 'active').length
//   const activeTeachers = teacherData.filter((t) => t.status === 'active').length
//   const activeClasses = classData.filter((c) => c.status === 'active').length
//   const activeSubjects = subjectData.filter((s) => s.status === 'active').length

//   const totalCapacity = classData.reduce((sum, c) => sum + c.capacity, 0)
//   const totalEnrolled = classData.reduce((sum, c) => sum + (c.students?.length || 0), 0)

//   const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
//     <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
//       <div className="flex items-start justify-between">
//         <div className="flex items-center gap-3">
//           <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
//             <Icon className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <p className="text-sm text-text-tertiary">{title}</p>
//             <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
//             {subtitle && <p className="text-xs text-text-secondary mt-1">{subtitle}</p>}
//           </div>
//         </div>
//       </div>
//     </div>
//   )

//   const ReportSection = ({ title, icon: Icon, children }: any) => (
//     <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
//       <div className="flex items-center gap-3 mb-6">
//         <Icon className="w-5 h-5 text-accent-primary" />
//         <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
//       </div>
//       {children}
//     </div>
//   )

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-text-primary">Reports</h1>
//           <p className="text-text-secondary mt-1">View comprehensive statistics and analytics</p>
//         </div>
//         <button className="flex items-center gap-2 px-4 py-2 border border-border-primary bg-background-tertiary text-text-secondary rounded-lg hover:bg-background-secondary transition-all duration-200">
//           <Download className="w-4 h-4" />
//           Export Report
//         </button>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           icon={Users}
//           title="Total Students"
//           value={studentData.length}
//           subtitle={`${activeStudents} active`}
//           color="bg-accent-primary"
//         />
//         <StatCard
//           icon={GraduationCap}
//           title="Total Teachers"
//           value={teacherData.length}
//           subtitle={`${activeTeachers} active`}
//           color="bg-success-bg"
//         />
//         <StatCard
//           icon={Layers}
//           title="Total Classes"
//           value={classData.length}
//           subtitle={`${activeClasses} active`}
//           color="bg-warning-bg"
//         />
//         <StatCard
//           icon={BookOpen}
//           title="Total Subjects"
//           value={subjectData.length}
//           subtitle={`${activeSubjects} active`}
//           color="bg-accent-muted"
//         />
//       </div>

//       {/* Enrollment Overview */}
//       <ReportSection title="Enrollment Overview" icon={TrendingUp}>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-background-tertiary rounded-lg p-4">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm text-text-tertiary">Total Capacity</span>
//               <Users className="w-4 h-4 text-text-tertiary" />
//             </div>
//             <p className="text-xl font-bold text-text-primary">{totalCapacity}</p>
//           </div>
//           <div className="bg-background-tertiary rounded-lg p-4">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm text-text-tertiary">Total Enrolled</span>
//               <CheckCircle className="w-4 h-4 text-success-text" />
//             </div>
//             <p className="text-xl font-bold text-text-primary">{totalEnrolled}</p>
//           </div>
//           <div className="bg-background-tertiary rounded-lg p-4">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm text-text-tertiary">Available Seats</span>
//               <Clock className="w-4 h-4 text-accent-primary" />
//             </div>
//             <p className="text-xl font-bold text-text-primary">{totalCapacity - totalEnrolled}</p>
//           </div>
//         </div>
//         <div className="mt-4">
//           <div className="flex items-center justify-between text-sm mb-2">
//             <span className="text-text-secondary">Enrollment Rate</span>
//             <span className="font-medium text-text-primary">
//               {totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0}%
//             </span>
//           </div>
//           <div className="w-full bg-background-tertiary rounded-full h-2">
//             <div
//               className="bg-accent-primary h-2 rounded-full transition-all duration-300"
//               style={{
//                 width: `${totalCapacity > 0 ? (totalEnrolled / totalCapacity) * 100 : 0}%`,
//               }}
//             />
//           </div>
//         </div>
//       </ReportSection>

//       {/* Status Breakdown */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <ReportSection title="Student Status" icon={Users}>
//           <div className="space-y-4">
//             {['active', 'inactive', 'graduated'].map((status) => {
//               const count = studentData.filter((s) => s.status === status).length
//               const percentage = studentData.length > 0 ? (count / studentData.length) * 100 : 0
//               const colors = {
//                 active: 'bg-success-bg text-success-text',
//                 inactive: 'bg-background-tertiary text-text-secondary',
//                 graduated: 'bg-accent-muted text-accent-primary',
//               }
//               const barColors = {
//                 active: 'bg-success-bg',
//                 inactive: 'bg-background-tertiary',
//                 graduated: 'bg-accent-muted',
//               }
//               return (
//                 <div key={status}>
//                   <div className="flex items-center justify-between text-sm mb-2">
//                     <div className="flex items-center gap-2">
//                       <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
//                         {status}
//                       </span>
//                       <span className="text-text-secondary">{count}</span>
//                     </div>
//                     <span className="text-text-tertiary">{percentage.toFixed(1)}%</span>
//                   </div>
//                   <div className="w-full bg-background-tertiary rounded-full h-2">
//                     <div
//                       className={`${barColors[status as keyof typeof barColors]} h-2 rounded-full transition-all duration-300`}
//                       style={{ width: `${percentage}%` }}
//                     />
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </ReportSection>

//         <ReportSection title="Teacher Status" icon={GraduationCap}>
//           <div className="space-y-4">
//             {['active', 'inactive', 'on-leave'].map((status) => {
//               const count = teacherData.filter((t) => t.status === status).length
//               const percentage = teacherData.length > 0 ? (count / teacherData.length) * 100 : 0
//               const colors = {
//                 active: 'bg-success-bg text-success-text',
//                 inactive: 'bg-background-tertiary text-text-secondary',
//                 'on-leave': 'bg-warning-bg text-warning-text',
//               }
//               const barColors = {
//                 active: 'bg-success-bg',
//                 inactive: 'bg-background-tertiary',
//                 'on-leave': 'bg-warning-bg',
//               }
//               return (
//                 <div key={status}>
//                   <div className="flex items-center justify-between text-sm mb-2">
//                     <div className="flex items-center gap-2">
//                       <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
//                         {status}
//                       </span>
//                       <span className="text-text-secondary">{count}</span>
//                     </div>
//                     <span className="text-text-tertiary">{percentage.toFixed(1)}%</span>
//                   </div>
//                   <div className="w-full bg-background-tertiary rounded-full h-2">
//                     <div
//                       className={`${barColors[status as keyof typeof barColors]} h-2 rounded-full transition-all duration-300`}
//                       style={{ width: `${percentage}%` }}
//                     />
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </ReportSection>
//       </div>

//       {/* Class Distribution */}
//       <ReportSection title="Class Distribution by Grade" icon={Layers}>
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//           {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((grade) => {
//             const count = classData.filter((c) => c.grade === grade).length
//             return (
//               <div key={grade} className="bg-background-tertiary rounded-lg p-4 text-center">
//                 <p className="text-sm text-text-tertiary mb-1">{grade}</p>
//                 <p className="text-xl font-bold text-text-primary">{count}</p>
//               </div>
//             )
//           })}
//         </div>
//       </ReportSection>

//       {/* Subject Types */}
//       <ReportSection title="Subject Types" icon={BookOpen}>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {['core', 'elective', 'optional'].map((type) => {
//             const count = subjectData.filter((s) => s.type === type).length
//             const percentage = subjectData.length > 0 ? (count / subjectData.length) * 100 : 0
//             const colors = {
//               core: 'bg-accent-muted text-accent-primary',
//               elective: 'bg-success-bg text-success-text',
//               optional: 'bg-background-tertiary text-text-secondary',
//             }
//             return (
//               <div key={type} className="bg-background-tertiary rounded-lg p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[type as keyof typeof colors]}`}>
//                     {type}
//                   </span>
//                   <span className="text-sm text-text-tertiary">{percentage.toFixed(1)}%</span>
//                 </div>
//                 <p className="text-2xl font-bold text-text-primary">{count}</p>
//               </div>
//             )
//           })}
//         </div>
//       </ReportSection>
//     </div>
//   )
// }

// export default Reports
