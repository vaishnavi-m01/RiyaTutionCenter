export interface Student {
    id: number;
    name: string;
    phone: string;
    school: string;
    standardId: number;
    standardName: string;
    mediumId: number;
    mediumName: string;
    age: number;
    gender: string;
    dateOfBirth: string;
    joiningDate: string;
    address: string;
    place: string;
    imageUrl: string;
    activeStatus: boolean;
    createdDate?: string;
    modifiedDate?: string;
}

export type RootStackParmaList = {
    Splash: undefined;
    Tabs: { screen?: 'Dashboard' | 'Student' | 'Attendance' | 'Fees' | 'Reports' } | undefined;
    CreateStudent?: { student?: Student; headerTitle?: string };
    AddStudentForm: undefined
    StudentDetails: { student: Student };
    FeesForm: undefined;
    Profile: undefined;
    Settings: undefined;
    ClassFees: undefined;
    Standard: undefined;
    Medium: undefined;
    AddClassFees: undefined;
    SignIn: undefined;
    SignUp: undefined;
    BirthdayTemplateSettings: undefined;
    FeesHistory: undefined;
}
