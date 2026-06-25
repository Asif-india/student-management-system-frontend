// Recent Activities section component
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserPlus, FileText, Layers, BookOpen, GraduationCap, CalendarCheck } from 'lucide-react'
import { ActivityCard } from '../ui'
import { studentService } from '../../services/studentService'
import { teacherService } from '../../services/teacherService'
import classService from '../../services/classService'
import subjectService from '../../services/subjectService'
import attendanceService from '../../services/attendanceService'
import { getRelativeTime } from '../../utils/timeUtils'

interface Activity {
  icon: any
  title: string
  description: string
  time: string
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'teal' | 'cyan'
  createdAt: Date
}

const RecentActivities: React.FC = () => {
  // Fetch latest data from all modules
  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentService.getStudents({ page: 1, limit: 5 }),
  })

  const { data: teachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => teacherService.getTeachers({ page: 1, limit: 5 }),
  })

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classService.getAllClasses({ page: 1, limit: 5 }),
  })

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectService.getAllSubjects({ page: 1, limit: 5 }),
  })

  const { data: attendance } = useQuery({
    queryKey: ['attendance'],
    queryFn: () => attendanceService.getAttendanceList({ page: 1, limit: 5 }),
  })

  // Transform entities to activities
  const transformToActivities = (): Activity[] => {
    const activities: Activity[] = []

    // Transform students
    const studentData = students?.data || []
    studentData.forEach((student: any) => {
      activities.push({
        icon: UserPlus,
        title: 'New Student Enrolled',
        description: `${student.firstName} ${student.lastName} enrolled`,
        time: getRelativeTime(student.createdAt),
        color: 'blue',
        createdAt: new Date(student.createdAt),
      })
    })

    // Transform teachers
    const teacherData = teachers?.data || []
    teacherData.forEach((teacher: any) => {
      activities.push({
        icon: GraduationCap,
        title: 'New Teacher Added',
        description: `${teacher.firstName} ${teacher.lastName} joined as ${teacher.department || 'teacher'}`,
        time: getRelativeTime(teacher.createdAt),
        color: 'green',
        createdAt: new Date(teacher.createdAt),
      })
    })

    // Transform classes
    const classData = classes?.data || []
    classData.forEach((classItem: any) => {
      activities.push({
        icon: Layers,
        title: 'Class Created',
        description: `${classItem.name} (${classItem.grade} - ${classItem.section})`,
        time: getRelativeTime(classItem.createdAt),
        color: 'purple',
        createdAt: new Date(classItem.createdAt),
      })
    })

    // Transform subjects
    const subjectData = subjects?.data || []
    subjectData.forEach((subject: any) => {
      activities.push({
        icon: BookOpen,
        title: 'Subject Added',
        description: `${subject.name} (${subject.type})`,
        time: getRelativeTime(subject.createdAt),
        color: 'yellow',
        createdAt: new Date(subject.createdAt),
      })
    })

    // Transform attendance
    const attendanceData = attendance?.data || []
    attendanceData.forEach((attendanceRecord: any) => {
      activities.push({
        icon: CalendarCheck,
        title: 'Attendance Marked',
        description: `${attendanceRecord.studentId?.firstName || 'Student'} marked ${attendanceRecord.status}`,
        time: getRelativeTime(attendanceRecord.createdAt),
        color: 'cyan',
        createdAt: new Date(attendanceRecord.createdAt),
      })
    })

    // Add placeholder activities for non-implemented features
    const placeholderActivities: Activity[] = [
      {
        icon: FileText,
        title: 'Assignment Submitted',
        description: 'Assignment module coming soon',
        time: 'Coming soon',
        color: 'green',
        createdAt: new Date(0),
      },
    ]

    // Combine real activities with placeholders
    const allActivities = [...activities, ...placeholderActivities]

    // Sort by createdAt descending (newest first)
    allActivities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    // Return top 10 activities
    return allActivities.slice(0, 20)
  }

  const activities = transformToActivities()
  const isLoading = !students && !teachers && !classes && !subjects && !attendance

  return (
    <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-border-primary p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-border-secondary transition-all duration-300 ease-out">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Activities</h2>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-secondary">No recent activities</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <ActivityCard
              key={`${activity.title}-${index}`}
              icon={activity.icon}
              title={activity.title}
              description={activity.description}
              time={activity.time}
              color={activity.color}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default RecentActivities
